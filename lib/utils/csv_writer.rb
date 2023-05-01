require "poppler"
require "tokenizers"
require "openai"
require "csv"

class CsvWriter
  MODEL_NAME = "curie"
  DOC_EMBEDDINGS_MODEL = "text-search-#{MODEL_NAME}-doc-001"

  def initialize(input_filename)
    @tokenizer = Tokenizers.from_pretrained("gpt2")
    @output_filename = "#{input_filename}.output.csv"
    @pdf = Poppler::Document.new(input_filename)
    @openai_client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
  end

  def write_csv
    column_headers = ["Page ", "page content", "token count", *(0..4096).to_a]
    CSV.open(@output_filename, "wb") do |csv|
      csv << column_headers
      build_rows.each do |row|
        csv << row
      end
    end
  end

  private

  def count_tokens(str)
    @tokenizer.encode(str).tokens.size
  end

  def get_page_embeddings(page_content)
    res = @openai_client.embeddings(parameters: {
      model: DOC_EMBEDDINGS_MODEL,
      input: page_content
    })

    res["data"][0]["embedding"]
  end

  def build_rows
    pages = @pdf.to_a[0..9] # only do a few pages b/c the openai api isn't free!!

    pages.map.with_index do |page, idx|
      row = ["Page #{idx}"]

      # page content
      page_content_ary = page.get_text.gsub("\n", " ").split(" ")
      page_content = page_content_ary.join(" ")
      row << page_content

      # token count
      row << page_content_ary.size

      # embeddings
      row.concat(get_page_embeddings(page_content))

      row
    end
  end
end