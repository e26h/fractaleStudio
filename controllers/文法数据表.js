"use strict";
//文法数据表(编辑完要点保存)
var editIndex_LS = undefined;
function endEditing_LS(){
	 if (editIndex_LS != undefined){
		$('#LS_tt').datagrid('endEdit', editIndex_LS);
		editIndex_LS = undefined;
	}
	return true;
}
function onClickRow_LS(index){
if (editIndex_LS != index){
		if (endEditing_LS()){
			$('#LS_tt').datagrid('selectRow', index)
					.datagrid('beginEdit', index);
			editIndex_LS = index;
		} else {
			$('#LS_tt').datagrid('selectRow', editIndex_LS);
		}
	}
}
function append_LS(){
	if (endEditing_LS()){
		$('#LS_tt').datagrid('appendRow',{LSRul:'',LSP:null});
		editIndex_LS = $('#LS_tt').datagrid('getRows').length-1;
		$('#LS_tt').datagrid('selectRow', editIndex_LS).datagrid('beginEdit', editIndex_LS);
	}
}
function removeit_LS(){
	if (editIndex_LS == undefined){return}
	$('#LS_tt').datagrid('cancelEdit', editIndex_LS)
			.datagrid('deleteRow', editIndex_LS);
	editIndex_LS = undefined;
}
function accept_LS(){
	if (endEditing_LS()){
		$('#LS_tt').datagrid('acceptChanges');
	}
}
function reject_LS(){
	$('#LS_tt').datagrid('rejectChanges');
	editIndex_LS = undefined;
}