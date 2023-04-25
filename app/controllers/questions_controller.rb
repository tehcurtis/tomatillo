class QuestionsController < ApplicationController
  def create
    render json: { made: "it" }
  end
end