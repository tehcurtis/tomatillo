class Question < ActiveRecord::Base

  before_save :ensure_question_mark

  private

  def ensure_question_mark
    return if question.ends_with?("?")

    self.question = question + "?"
  end
end
