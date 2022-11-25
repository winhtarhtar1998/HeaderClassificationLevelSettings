class CreateHeaderClassificationLevelSetting < ActiveRecord::Migration[6.1]
  def change
    create_table :header_classification_level_settings do |t|
      t.string :upperlevelkeyword
      t.integer :uplevel_header_classification_id
      t.string :lowerlevel_keyword
      t.integer :lolevel_header_classification_id
      t.integer :del_flg
      t.integer :created_user
      t.timestamp :created_at
      t.integer :updated_user
      t.timestamp :updated_at
    end
  end
end
