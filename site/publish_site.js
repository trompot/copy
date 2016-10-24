/*

	ページ部品を組み合わせて，Webサイト全体のHTMLを構築するスクリプト
	
	
	使い方：
		・publish_site.batをダブルクリック。
		
	ファイル構成：
		・dev\elements以下に，共通部品を置く。
		・dev\pages以下に，HTMLを置く。
		・それぞれのHTMLの中では，
			#（部品名）#
		  と書けば，指定した部品HTMLの内容を読み込める。
		  例えば，
			#footer#
		  と書くと，dev\elements\footer.html の内容がそこに埋め込まれる。

*/


// ----------  前処理  ----------

// デバッグ用：ポップアップ出力
function log( s )
{
	WScript.Echo( s );
}

// デバッグ用：標準出力
function out( s )
{
	var o = WScript.StdOut;
	o.WriteLine( s );
}

// 設定
var dir_dev			= "dev"; // 開発用フォルダ
var dir_pages		= dir_dev + "\\pages"; // ページ
var dir_elements	= dir_dev + "\\elements"; // 共通部品
var dir_publish		= "publish"; // 完成品用フォルダ


// 定数
var ForReading   = 1; // 読み込み
var ForWriting   = 2; // 書き込み（上書き）
var ForAppending = 8; // 書き込み（追記）
	// http://d.hatena.ne.jp/language_and_engineering/20081017/1224168811


// このディレクトリのパスを取得
var ws = WScript.CreateObject("WScript.Shell");
var arr_dir_script = WScript.ScriptFullName.split("\\");
	// http://wsh.style-mods.net/ref_wscript/index.htm
arr_dir_script.pop();
var dir_script = arr_dir_script.join("\\");
	//log( dir_script );



// ----------  共通部品を読み込み  ----------



// 全エレメントを読み込み
ws.CurrentDirectory = dir_script + "\\" + dir_elements;
var proc = ws.Exec("cmd.exe /c dir /s /b *.html");
var res = proc.StdOut.ReadAll().split("\r\n");
	// 注：ここで"\n"だけにするとあとで\rが残ってひどい目にあう
var fso_r = WScript.CreateObject( "Scripting.FileSystemObject" );
// 登録用の配列
var arr_elems = new Array();
var obj_elems = {};
for( var i = 0; i < res.length; i ++ )
{
	var elem_name = res[i];
	
	// 有効なファイル名か
	if( elem_name.length < 1 )
	{
		continue;
	}
		//log( elem_name );
	
	// 全行読み出し
	//var elem_path = dir_script + "\\" + dir_elements + "\\" + elem_name;
	//	log( elem_path );
	var txt_r = fso_r.OpenTextFile( elem_name, ForReading );
	var str = "";
	while( ! txt_r.AtEndOfStream )
	{
		str += txt_r.ReadLine() + "\r\n";
			// 注：ここで\r\nの付加を忘れるとあとでひどい目にあう
	}
	txt_r.Close();
	
	// ファイル名と内容を登録
	var arr_elem_key = elem_name.split("\\");
	var elem_key = arr_elem_key[ arr_elem_key.length - 1 ].replace(".html", "");
		//log( elem_key );
	arr_elems.push( { 
		"name" : elem_key,
		"str"  : str
	});
	obj_elems[ elem_key ] = str;
}


// エレメント内で置換
for( var i = 0; i < arr_elems.length; i ++ )
{
	var target_element = arr_elems[i].name;
	var target_str = arr_elems[i].str;
	for( var j = 0; j < arr_elems.length; j ++ )
	{
		target_str = target_str.replace(
			new RegExp( "#(.+)#", "gi" ),
			// 1 番目にマッチした文字列($1)をキーにして値を返す
			function(){
					//log( "match:" + arguments[ 1 ] );
					//log( "into:" + obj_elems[ arguments[ 1 ]] );
				return obj_elems[ arguments[ 1 ] ]; 
			}
		);
			// http://d.hatena.ne.jp/language_and_engineering/20080924/1222174957
			// http://itmst.blog71.fc2.com/blog-entry-74.html
	}
	
	// 置換済み文字列を再登録
	obj_elems[ target_element ] = target_str;
}



// ----------  ページを生成  ----------



// 全ページを完成品側にコピー
ws.CurrentDirectory = dir_script;
proc = ws.Exec("cmd.exe /c xcopy /s /h " + dir_pages + "\\* .\\" + dir_publish + "\\");
	// xcopy /s /h dev\pages\* .\publish\
	// http://d.hatena.ne.jp/language_and_engineering/20081001/1222857265
res = proc.StdOut.ReadAll().split("\r\n");


// 全ページを読み込み
ws.CurrentDirectory = dir_script + "\\" + dir_publish;
proc = ws.Exec("cmd.exe /c dir /s /b *.html");
res = proc.StdOut.ReadAll().split("\r\n");
// 登録用の配列
var arr_pages = new Array();
var obj_pages = {};
for( var i = 0; i < res.length; i ++ )
{
	var page_name = res[i];
	
	// 有効なファイル名か
	if( page_name.length < 1 )
	{
		continue;
	}
	
	// 全行読み出し
	var txt_r = fso_r.OpenTextFile( page_name, ForReading );
	var str = "";
	while( ! txt_r.AtEndOfStream )
	{
		str += txt_r.ReadLine() + "\r\n";
	}
	txt_r.Close();
	
	// ファイル名と内容を登録
	arr_pages.push( { 
		"name" : page_name,
		"str"  : str
	});
	obj_pages[ page_name ] = str;
}
	//log( arr_pages[0].name );
	//log( arr_pages[0].str );


// 全ページを置換
var fso_w = WScript.CreateObject( "Scripting.FileSystemObject" );
for( var i = 0; i < arr_pages.length; i ++ )
{
	var target_page = arr_pages[i].name;
		//log( target_page );
	var target_str = arr_pages[i].str;
	for( var j = 0; j < arr_elems.length; j ++ )
	{
		target_str = target_str.replace(
			new RegExp( "#(.+)#", "gi" ),
			function(){
					//log( "match:" + arguments[ 1 ] );
					//log( "into:" + obj_elems[ arguments[ 1 ]] );
				return obj_elems[ arguments[ 1 ] ]; 
			}
		);
	}
		//log( target_str );
	
	// 置換済み文字列を書き込み
	fso_w.DeleteFile( target_page );
	fso_w.CreateTextFile( target_page );
	var txt_w = fso_w.OpenTextFile( target_page,   ForWriting );
	txt_w.WriteLine( target_str );
	txt_w.Close();
}



