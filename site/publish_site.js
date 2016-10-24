/*

	�y�[�W���i��g�ݍ��킹�āCWeb�T�C�g�S�̂�HTML���\�z����X�N���v�g
	
	
	�g�����F
		�Epublish_site.bat���_�u���N���b�N�B
		
	�t�@�C���\���F
		�Edev\elements�ȉ��ɁC���ʕ��i��u���B
		�Edev\pages�ȉ��ɁCHTML��u���B
		�E���ꂼ���HTML�̒��ł́C
			#�i���i���j#
		  �Ə����΁C�w�肵�����iHTML�̓��e��ǂݍ��߂�B
		  �Ⴆ�΁C
			#footer#
		  �Ə����ƁCdev\elements\footer.html �̓��e�������ɖ��ߍ��܂��B

*/


// ----------  �O����  ----------

// �f�o�b�O�p�F�|�b�v�A�b�v�o��
function log( s )
{
	WScript.Echo( s );
}

// �f�o�b�O�p�F�W���o��
function out( s )
{
	var o = WScript.StdOut;
	o.WriteLine( s );
}

// �ݒ�
var dir_dev			= "dev"; // �J���p�t�H���_
var dir_pages		= dir_dev + "\\pages"; // �y�[�W
var dir_elements	= dir_dev + "\\elements"; // ���ʕ��i
var dir_publish		= "publish"; // �����i�p�t�H���_


// �萔
var ForReading   = 1; // �ǂݍ���
var ForWriting   = 2; // �������݁i�㏑���j
var ForAppending = 8; // �������݁i�ǋL�j
	// http://d.hatena.ne.jp/language_and_engineering/20081017/1224168811


// ���̃f�B���N�g���̃p�X���擾
var ws = WScript.CreateObject("WScript.Shell");
var arr_dir_script = WScript.ScriptFullName.split("\\");
	// http://wsh.style-mods.net/ref_wscript/index.htm
arr_dir_script.pop();
var dir_script = arr_dir_script.join("\\");
	//log( dir_script );



// ----------  ���ʕ��i��ǂݍ���  ----------



// �S�G�������g��ǂݍ���
ws.CurrentDirectory = dir_script + "\\" + dir_elements;
var proc = ws.Exec("cmd.exe /c dir /s /b *.html");
var res = proc.StdOut.ReadAll().split("\r\n");
	// ���F������"\n"�����ɂ���Ƃ��Ƃ�\r���c���ĂЂǂ��ڂɂ���
var fso_r = WScript.CreateObject( "Scripting.FileSystemObject" );
// �o�^�p�̔z��
var arr_elems = new Array();
var obj_elems = {};
for( var i = 0; i < res.length; i ++ )
{
	var elem_name = res[i];
	
	// �L���ȃt�@�C������
	if( elem_name.length < 1 )
	{
		continue;
	}
		//log( elem_name );
	
	// �S�s�ǂݏo��
	//var elem_path = dir_script + "\\" + dir_elements + "\\" + elem_name;
	//	log( elem_path );
	var txt_r = fso_r.OpenTextFile( elem_name, ForReading );
	var str = "";
	while( ! txt_r.AtEndOfStream )
	{
		str += txt_r.ReadLine() + "\r\n";
			// ���F������\r\n�̕t����Y���Ƃ��ƂłЂǂ��ڂɂ���
	}
	txt_r.Close();
	
	// �t�@�C�����Ɠ��e��o�^
	var arr_elem_key = elem_name.split("\\");
	var elem_key = arr_elem_key[ arr_elem_key.length - 1 ].replace(".html", "");
		//log( elem_key );
	arr_elems.push( { 
		"name" : elem_key,
		"str"  : str
	});
	obj_elems[ elem_key ] = str;
}


// �G�������g���Œu��
for( var i = 0; i < arr_elems.length; i ++ )
{
	var target_element = arr_elems[i].name;
	var target_str = arr_elems[i].str;
	for( var j = 0; j < arr_elems.length; j ++ )
	{
		target_str = target_str.replace(
			new RegExp( "#(.+)#", "gi" ),
			// 1 �ԖڂɃ}�b�`����������($1)���L�[�ɂ��Ēl��Ԃ�
			function(){
					//log( "match:" + arguments[ 1 ] );
					//log( "into:" + obj_elems[ arguments[ 1 ]] );
				return obj_elems[ arguments[ 1 ] ]; 
			}
		);
			// http://d.hatena.ne.jp/language_and_engineering/20080924/1222174957
			// http://itmst.blog71.fc2.com/blog-entry-74.html
	}
	
	// �u���ςݕ�������ēo�^
	obj_elems[ target_element ] = target_str;
}



// ----------  �y�[�W�𐶐�  ----------



// �S�y�[�W�������i���ɃR�s�[
ws.CurrentDirectory = dir_script;
proc = ws.Exec("cmd.exe /c xcopy /s /h " + dir_pages + "\\* .\\" + dir_publish + "\\");
	// xcopy /s /h dev\pages\* .\publish\
	// http://d.hatena.ne.jp/language_and_engineering/20081001/1222857265
res = proc.StdOut.ReadAll().split("\r\n");


// �S�y�[�W��ǂݍ���
ws.CurrentDirectory = dir_script + "\\" + dir_publish;
proc = ws.Exec("cmd.exe /c dir /s /b *.html");
res = proc.StdOut.ReadAll().split("\r\n");
// �o�^�p�̔z��
var arr_pages = new Array();
var obj_pages = {};
for( var i = 0; i < res.length; i ++ )
{
	var page_name = res[i];
	
	// �L���ȃt�@�C������
	if( page_name.length < 1 )
	{
		continue;
	}
	
	// �S�s�ǂݏo��
	var txt_r = fso_r.OpenTextFile( page_name, ForReading );
	var str = "";
	while( ! txt_r.AtEndOfStream )
	{
		str += txt_r.ReadLine() + "\r\n";
	}
	txt_r.Close();
	
	// �t�@�C�����Ɠ��e��o�^
	arr_pages.push( { 
		"name" : page_name,
		"str"  : str
	});
	obj_pages[ page_name ] = str;
}
	//log( arr_pages[0].name );
	//log( arr_pages[0].str );


// �S�y�[�W��u��
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
	
	// �u���ςݕ��������������
	fso_w.DeleteFile( target_page );
	fso_w.CreateTextFile( target_page );
	var txt_w = fso_w.OpenTextFile( target_page,   ForWriting );
	txt_w.WriteLine( target_str );
	txt_w.Close();
}



