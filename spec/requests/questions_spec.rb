require "rails_helper"

RSpec.describe "Questions", type: :request do
  describe "#show" do
    let(:question) { create(:question) }

    it "assigns @question" do
      get "/question/#{question.id}"

      expect(assigns[:question]).to eq(question)
    end
  end
end