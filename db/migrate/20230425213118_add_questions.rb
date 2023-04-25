class AddQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :questions do |t|
      t.string :question, limit: 140
      t.string :answer, limit: 1000, null: true
      t.string :audio_src_url, limit: 255, null: true
      t.integer :ask_count, default: 1
      t.string :context, null: true
      t.timestamps
    end
  end
end
