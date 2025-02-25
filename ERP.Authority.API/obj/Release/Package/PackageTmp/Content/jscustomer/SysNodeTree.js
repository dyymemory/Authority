﻿var SysNodeTree = {
	BuildJsonDate: function (jsonArr) {
		var listSorted = [];
		jsonArr = jsonArr.sort(SysNodeTree.GetRootNode);
		jsonArr.forEach(function (item) {
			SysNodeTree.SortNodeInfo(item, jsonArr, listSorted);
		});
		return listSorted;
	},
	GetRootNode: function (a, b) {
		return a.ParentID - b.ParentID;
	},
	SortNodeInfo: function (obj, jsonArr, listSorted) {
		//debugger;
		if (SysNodeTree.IsContain(obj, listSorted)) {
			return;
		}
		listSorted.push(obj);
		delete jsonArr[jsonArr.indexOf(obj)];
		if (!obj.ID) {
			return;
		}
		jsonArr.forEach(function (item) {
			if (obj.ID == item.ParentID) {
				SysNodeTree.SortNodeInfo(item, jsonArr, listSorted);
			}
		});
	},
	IsContain: function (obj, listSorted) {
		for (var index in listSorted) {
			if (obj.ID == listSorted[index].ID) {
				return true;
			}
		}
		return false;
	}
};