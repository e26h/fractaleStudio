"use strict";
//迭代数据表
var editIndex = undefined;
function endEditing(){
	 if (editIndex != undefined){
		$('#IFS_dg').datagrid('endEdit', editIndex);
		editIndex = undefined;
	}
	return true;
	}
function onClickRow(index){
if (editIndex != index){
		if (endEditing()){
			$('#IFS_dg').datagrid('selectRow', index)
					.datagrid('beginEdit', index);
			editIndex = index;
		} else {
			$('#IFS_dg').datagrid('selectRow', editIndex);
		}
	}
}
function append(){
	if (endEditing()){
		$('#IFS_dg').datagrid('appendRow',{a:0,b:0,c:0,d:0,e:0,f:0,P:0});
		editIndex = $('#IFS_dg').datagrid('getRows').length-1;
		$('#IFS_dg').datagrid('selectRow', editIndex)
				.datagrid('beginEdit', editIndex);
	}
}
function removeit(){
	if (editIndex == undefined){return}
	$('#IFS_dg').datagrid('cancelEdit', editIndex)
			.datagrid('deleteRow', editIndex);
	editIndex = undefined;
}
function accept(){
	if (endEditing()){
		$('#IFS_dg').datagrid('acceptChanges');
	}
}
function reject(){
	$('#IFS_dg').datagrid('rejectChanges');
	editIndex = undefined;
}