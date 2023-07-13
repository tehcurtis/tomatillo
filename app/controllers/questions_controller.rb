require 'csv'

class QuestionsController < ApplicationController
  MODEL_NAME = "curie"
  QUERY_EMBEDDINGS_MODEL = "text-search-#{MODEL_NAME}-query-001"
  COMPLETIONS_MODEL = "text-davinci-003"
  SEPARATOR = "\n* "
  SEPARATOR_LEN = 3
  MAX_SECTION_LEN = 500

  def create
    params.require(:question)

    previous_question = Question.where(question: params[:question]).order(:created_at, :desc).first
    if previous_question&.answer&.present? && previous_question&.audio_src_url&.present?
      p "////// previously asked and answered"
      p previous_question
      previous_question.update(ask_count: previous_question.ask_count += 1)
      render json: question_presenter(previous_question)
      return
    end

    # hack: Pandas.read_csv was causing segfaults so let's try another route
    csv_data = []
    CSV.read(ENV["LOCAL_DATA_FILENAME"], headers: true, return_headers: false).each do |row|
      csv_data << row
    end

    df = Pandas::DataFrame.new(csv_data.map(&:fields), columns: ["Page", "page content", "token count", *(0..4096).to_a])
    @openai_client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
    answer, context = answer_query_with_context(params[:question], df)

    res = Resemble::V2::Clip.create_sync(
      ENV['RESEMBLE_PROJECT_UUID'],
      ENV['RESEMBLE_VOICE_UUID'],
      answer,
      title: nil,
      sample_rate: nil,
      output_format: nil,
      precision: nil,
      include_timestamps: nil,
      is_public: nil,
      is_archived: nil
    )

    audio_src_url = res['success'] == false ? "http://example.com/no-bueno" : res['item']['audio_src']

    question = Question.new(question: params[:question], answer: answer, context: context, audio_src_url: audio_src_url)
    question.save!

    render json: question_presenter(question)
  end

  def show
    @question = Question.find(params.require(:id))
  end

  private

  def question_presenter(question)
    {
      question: {
        id: question.id,
        question: question.question,
        answer: question.answer,
        audio_src_url: question.audio_src_url
      }
    }
  end

  def answer_query_with_context(query, df)
    prompt, context = construct_prompt(query, df)

    res = @openai_client.completions(parameters: {
      prompt: prompt,
      temperature: 0.0,
      max_tokens: 150,
      model: COMPLETIONS_MODEL
    })

    [res["choices"][0]["text"].strip.gsub(/^\n+|\n+$/, ''), context]
  end

  def construct_prompt(query, df)
    most_relevant_document_sections = order_document_sections_by_query_similarity(query, df)

    chosen_sections = []
    chosen_sections_len = 0
    chosen_sections_indexes = []

    most_relevant_document_sections.each do |rating, idx|
      document_section = df.loc[df['Page'] == "Page #{idx}"].iloc[0]

      chosen_sections_len += document_section['token count'].to_i + SEPARATOR_LEN
      if chosen_sections_len > MAX_SECTION_LEN
        space_left = MAX_SECTION_LEN - chosen_sections_len - SEPARATOR.size
        chosen_sections << SEPARATOR + document_section['page content'][0..(space_left - 1)]
        chosen_sections_indexes << idx
        break
      end

      chosen_sections<< (SEPARATOR + document_section['page content'])
      chosen_sections_indexes << idx
    end

    header = """Sahil Lavingia is the founder and CEO of Gumroad, and the author of the book The Minimalist Entrepreneur (also known as TME). These are questions and answers by him. Please keep your answers to three sentences maximum, and speak in complete sentences. Stop speaking once your point is made.\n\nContext that may be useful, pulled from The Minimalist Entrepreneur:\n"""

    question_1 = "\n\n\nQ: How to choose what business to start?\n\nA: First off don't be in a rush. Look around you, see what problems you or other people are facing, and solve one of these problems if you see some overlap with your passions or skills. Or, even if you don't see an overlap, imagine how you would solve that problem anyway. Start super, super small."
    question_2 = "\n\n\nQ: Q: Should we start the business on the side first or should we put full effort right from the start?\n\nA:   Always on the side. Things start small and get bigger from there, and I don't know if I would ever “fully” commit to something unless I had some semblance of customer traction. Like with this product I'm working on now!"
    question_3 = "\n\n\nQ: Should we sell first than build or the other way around?\n\nA: I would recommend building first. Building will teach you a lot, and too many people use “sales” as an excuse to never learn essential skills like building. You can't sell a house you can't build!"
    question_4 = "\n\n\nQ: Andrew Chen has a book on this so maybe touché, but how should founders think about the cold start problem? Businesses are hard to start, and even harder to sustain but the latter is somewhat defined and structured, whereas the former is the vast unknown. Not sure if it's worthy, but this is something I have personally struggled with\n\nA: Hey, this is about my book, not his! I would solve the problem from a single player perspective first. For example, Gumroad is useful to a creator looking to sell something even if no one is currently using the platform. Usage helps, but it's not necessary."
    question_5 = "\n\n\nQ: What is one business that you think is ripe for a minimalist Entrepreneur innovation that isn't currently being pursued by your community?\n\nA: I would move to a place outside of a big city and watch how broken, slow, and non-automated most things are. And of course the big categories like housing, transportation, toys, healthcare, supply chain, food, and more, are constantly being upturned. Go to an industry conference and it's all they talk about! Any industry…"
    question_6 = "\n\n\nQ: How can you tell if your pricing is right? If you are leaving money on the table\n\nA: I would work backwards from the kind of success you want, how many customers you think you can reasonably get to within a few years, and then reverse engineer how much it should be priced to make that work."
    question_7 = "\n\n\nQ: Why is the name of your book 'the minimalist entrepreneur' \n\nA: I think more people should start businesses, and was hoping that making it feel more “minimal” would make it feel more achievable and lead more people to starting-the hardest step."
    question_8 = "\n\n\nQ: How long it takes to write TME\n\nA: About 500 hours over the course of a year or two, including book proposal and outline."
    question_9 = "\n\n\nQ: What is the best way to distribute surveys to test my product idea\n\nA: I use Google Forms and my email list / Twitter account. Works great and is 100% free."
    question_10 = "\n\n\nQ: How do you know, when to quit\n\nA: When I'm bored, no longer learning, not earning enough, getting physically unhealthy, etc… loads of reasons. I think the default should be to “quit” and work on something new. Few things are worth holding your attention for a long period of time."

    [(header + chosen_sections.join('') + question_1 + question_2 + question_3 + question_4 + question_5 + question_6 + question_7 + question_8 + question_9 + question_10 + "\n\n\nQ: " + query + "\n\nA: "), chosen_sections.join('')]
  end

  def order_document_sections_by_query_similarity(query, df)
    query_embedding = get_query_embedding(query)

    document_similarities = df.to_numpy.to_a.map.with_index do |doc_embedding, idx|
      [
        vector_similarity(query_embedding, doc_embedding),
        idx
      ]
    end

    document_similarities.sort.reverse
  end

  def get_query_embedding(query)
    get_embedding(query, QUERY_EMBEDDINGS_MODEL)
  end

  def get_embedding(query, model)
    res = @openai_client.embeddings(parameters: {
      model: model,
      input: query
    })

    res["data"][0]["embedding"]
  end

  def vector_similarity(x, y)
    y = y[3..-2].map(&:to_f)
    Numpy.dot(Numpy.asarray(x), Numpy.asarray(y))
  end
end
