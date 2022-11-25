class Api::V1::HeaderClassificationDictsController < ApplicationController
    skip_before_action :verify_authenticity_token

    # データ取得テーブル[headeer_classification_dict]header_classification_dicts.display_orderの昇順
    def index
      @keyword= HeaderClassificationDicts.where(del_flg: 0).order('display_order')
    render json: {keyword: @keyword}
    end
   
    #テーブル「header_classification_level_settings」にデータ保存する関数
    def create
      @upperkeyword = HeaderClassificationDicts.where(:keyword => params[:upperlevelkeyword])   
      @lowerkeyword = HeaderClassificationDicts.where(:keyword => params[:lowerlevel_keyword]) 
      if @upperkeyword.length !=0 && @lowerkeyword.length !=0
      @settings = HeaderClassificationLevelSetting.new(setting_params)
      @settings.created_user = 1
      @settings.updated_user = 1
      @settings.del_flg = 0
      @settings.uplevel_header_classification_id = @upperkeyword[0].id
      @settings.lolevel_header_classification_id = @lowerkeyword[0].id
      @settings.upperdisplayorder = @upperkeyword[0].display_order
      @settings.lowerdisplayorder = @lowerkeyword[0].display_order
      @settings.save
      render json: @settings
      else
        render json: {message: "ok"}
      end
    end
  
    #テーブル「header_classification_level_settings」にデータ更新する関数
    def update
      @keyword = HeaderClassificationLevelSetting.find(params[:id])
       @del_flg =@keyword.del_flg
       if(@del_flg == 0)
        @upperkeyword = HeaderClassificationDicts.where(:keyword => params[:upperlevelkeyword]) 
        @lowerkeyword = HeaderClassificationDicts.where(:keyword => params[:lowerlevel_keyword]) 
          if @upperkeyword.length !=0 && @lowerkeyword.length !=0
            @keyword.updated_user=2
            @keyword.uplevel_header_classification_id = @upperkeyword[0].id
            @keyword.lolevel_header_classification_id = @lowerkeyword[0].id
            @keyword.upperdisplayorder = @upperkeyword[0].display_order
            @keyword.lowerdisplayorder = @lowerkeyword[0].display_order
            @keyword.update(setting_params)
         render json: @keyword
          else
            render json: {message: "ok"}
          end
       else
        render json: {message: "ok"}
       end
    end
  
    #テーブル「header_classification_level_settings」にデータ削除する関数
    def destroy 
      begin      
        @keyword = HeaderClassificationLevelSetting.where(:id => params[:id], :del_flg=> 0).update(:del_flg=> 1,:updated_user=>3) 
        render json: {message: "ok"}
      rescue Exception => e
        render json: {message: "nok"}
      end
    end
   
    #テーブル「header_classification_level_settings」にデータ取得する関数
    def getlevelsetting
      @setting= HeaderClassificationLevelSetting.where(del_flg: 0).order('id')
      render json: {settings: @setting}
    end
    
    # データ設定
    private
    def setting_params
      params.permit(:upperlevelkeyword, :uplevel_header_classification_id, :lowerlevel_keyword, :lolevel_header_classification_id,:upperdisplayorder,:lowerdisplayorder)
    end
  end