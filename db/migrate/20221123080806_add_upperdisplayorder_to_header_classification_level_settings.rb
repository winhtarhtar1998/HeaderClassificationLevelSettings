class AddUpperdisplayorderToHeaderClassificationLevelSettings < ActiveRecord::Migration[6.1]
  def change
    add_column :header_classification_level_settings, :upperdisplayorder, :integer
  end
end
