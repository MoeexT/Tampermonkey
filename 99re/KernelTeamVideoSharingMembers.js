// ============================================================================
// Developed by Kernel Team.
// http://kernel-team.com
// ============================================================================

String.prototype.trim = function() {
	return this.replace(/^\s+/, '').replace(/\s+$/, '');
};

// Common functions for reuse =================================================

function stub() {
}

function commonGet(id) {
	return document.getElementById(id);
}

function commonValidId(id) {
	return (id && commonGet(id));
}

function commonShow(id) {
	if (commonValidId(id)) {
		commonGet(id).style.display = 'block';
	}
}

function commonHide(id) {
	if (commonValidId(id)) {
		commonGet(id).style.display = 'none';
	}
}

function commonProcessFieldError(fieldName, errorId) {
	for (var i = 0; i < 10; i++) {
		commonHide(fieldName + '_error_' + i);
	}
	commonShow(fieldName + '_' + errorId);
	return (errorId == null);
}

function commonValidateRequired(form, fieldName, errorCode) {
	if (!form[fieldName]) {
		return true;
	}
	if (form[fieldName].value.trim().length == 0) {
		return commonProcessFieldError(fieldName, errorCode);
	} else {
		return commonProcessFieldError(fieldName, null);
	}
}

function commonValidateRequiredList(form, fieldName, errorCode) {
	if (!form[fieldName + '[]']) {
		return true;
	}
	if (form[fieldName + '[]'].length) {
		var list = form[fieldName + '[]'];
		for (var i = 0; i < list.length; i++) {
			if (list[i].checked || (list[i].value != '' && list[i].selected)) {
				return commonProcessFieldError(fieldName, null);
			}
		}
		return commonProcessFieldError(fieldName, errorCode);
	}
	return true;
}

function commonValidateMinLength(form, fieldName, length, errorCode) {
	if (!form[fieldName]) {
		return true;
	}
	if (form[fieldName].value.trim().length < length) {
		return commonProcessFieldError(fieldName, errorCode);
	} else {
		return commonProcessFieldError(fieldName, null);
	}
}

function commonValidateMaxLengthList(form, fieldName, length, errorCode) {
	if (!form[fieldName + '[]']) {
		return true;
	}
	if (form[fieldName + '[]'].length) {
		var list = form[fieldName + '[]'];
		var count = 0;
		for (var i = 0; i < list.length; i++) {
			if (list[i].checked || list[i].selected) {
				count++;
			}
		}
		if (count > length) {
			return commonProcessFieldError(fieldName, errorCode);
		}
		return commonProcessFieldError(fieldName, null);
	}
	return true;
}

function commonValidatePasswords(form, fieldName1, fieldName2, errorCode) {
	if (!form[fieldName1] || !form[fieldName2]) {
		return true;
	}
	if (form[fieldName1].value != form[fieldName2].value) {
		return commonProcessFieldError(fieldName2, errorCode);
	} else {
		return commonProcessFieldError(fieldName2, null);
	}
}

function commonValidateEmail(form, fieldName, errorCode) {
	if (!form[fieldName]) {
		return true;
	}
	if (form[fieldName].value.trim().length == 0) {
		return commonProcessFieldError(fieldName, null);
	}
	var email = /^([^@])+@([^@])+\.([^@])+$/;
	if (!email.test(form[fieldName].value)) {
		return commonProcessFieldError(fieldName, errorCode);
	} else {
		return commonProcessFieldError(fieldName, null);
	}
}

function commonValidateFileExt(form, fieldName, ext, errorCode) {
	if (!form[fieldName]) {
		return true;
	}
	if (form[fieldName].value.trim().length == 0) {
		return commonProcessFieldError(fieldName, null);
	}
	if (!form[fieldName].value.match(new RegExp('[.]' + ext + '$', 'gi'))) {
		return commonProcessFieldError(fieldName, errorCode);
	} else {
		return commonProcessFieldError(fieldName, null);
	}
}

function listCommonEnableDeleteForm(params) {
	var form = params['form_id'];
	var confirmationText = params['delete_confirmation_text'];
	var noSelectedText = params['no_items_selected'];

	if (commonValidId(form)) {
		commonGet(form).onsubmit = function() {
			var selectedCount = 0;
			for (var i = 0; i < this.elements.length; i++) {
				var field = this.elements[i];
				if ((field.type == 'checkbox') && (field.checked)) {
					selectedCount++;
				}
			}
			if (selectedCount == 0) {
				alert(noSelectedText);
				return false;
			} else if (confirmationText) {
				if (params['delete_confirmation_text_' + selectedCount]) {
					return confirm(params['delete_confirmation_text_' + selectedCount]);
				}
				return confirm(confirmationText.replace('%1%',selectedCount));
			}
			return true;
		};
	}
}

// Member profile edit block functions ========================================

var memberProfileEditAdditionalVisible = false;

function memberProfileEditEnableFormProfile(params) {
	var form = params['form_id'];
	var addLink = params['additional_link_id'];
	var addBlock = params['additional_block_id'];

	if (commonValidId(addLink)) {
		commonGet(addLink).onclick = function() {
			if (memberProfileEditAdditionalVisible) {
				commonHide(addBlock);
			} else {
				commonShow(addBlock);
			}
			var st1 = (memberProfileEditAdditionalVisible ? 'collapse_link' : 'expand_link');
			var st2 = (!memberProfileEditAdditionalVisible ? 'collapse_link' : 'expand_link');
			memberProfileEditAdditionalVisible = !memberProfileEditAdditionalVisible;
			if (this.className.indexOf(st1) >= 0) {
				this.className = this.className.replace(st1, st2);
			}
			return false;
		};
	}

	if (commonValidId(form)) {
		commonGet(form).onsubmit = function() {
			var errorField = null;
			if (!commonValidateRequired(this, 'display_name', 'error_1')) {
				errorField = (errorField ? errorField : 'display_name');
			} else if (!commonValidateMinLength(this, 'display_name', 3, 'error_2')) {
				errorField = (errorField ? errorField : 'display_name');
			}
			var day = this['birth_date_Day'].selectedIndex;
			var month = this['birth_date_Month'].selectedIndex;
			var year = this['birth_date_Year'].selectedIndex;
			var sum = day + month + year;
			if (sum > 0) {
				if ((day == 0) || (month == 0) || (year == 0)) {
					commonProcessFieldError('birth_date', 'error_1');
					errorField = (errorField ? errorField : 'birth_date_Day');
				}
			}
			if (errorField) {
				this[errorField].focus();
			}
			return !errorField;
		};
	}
}

function memberProfileEditEnableFormPassword(params) {
	var form = params['form_id'];

	if (commonValidId(form)) {
		commonGet(form).onsubmit = function() {
			var errorField = null;
			if (!commonValidateRequired(this, 'old_pass', 'error_1')) {
				errorField = (errorField ? errorField : 'old_pass');
			}
			if (!commonValidateRequired(this, 'pass', 'error_1')) {
				errorField = (errorField ? errorField : 'pass');
			} else if (!commonValidateMinLength(this, 'pass', 5, 'error_2')) {
				errorField = (errorField ? errorField : 'pass');
			}
			if (!commonValidateRequired(this, 'pass2', 'error_1')) {
				errorField = (errorField ? errorField : 'pass2');
			} else if (!commonValidatePasswords(this, 'pass', 'pass2', 'error_2')) {
				errorField = (errorField ? errorField : 'pass2');
			}
			if (errorField) {
				this[errorField].focus();
			}
			return !errorField;
		};
	}
}

function memberProfileEditEnableFormEmail(params) {
	var form = params['form_id'];

	if (commonValidId(form)) {
		commonGet(form).onsubmit = function() {
			var errorField = null;
			if (!commonValidateRequired(this, 'email', 'error_1')) {
				errorField = (errorField ? errorField : 'email');
			} else if (!commonValidateEmail(this, 'email', 'error_2')) {
				errorField = (errorField ? errorField : 'email');
			}
			if (errorField) {
				this[errorField].focus();
			}
			return !errorField;
		};
	}
}

function memberProfileDeleteEnableForm(params) {
	var form = params['form_id'];

	if (commonValidId(form)) {
		commonGet(form).onsubmit = function() {
			if (!this['confirm_delete'].checked) {
				commonProcessFieldError('confirm_delete', 'error_1');
				return false;
			}
			return true;
		};
	}
}

// List videos functions ======================================================

function listVideosEnableDeleteForm(params) {
	listCommonEnableDeleteForm(params);
}

// List playlists functions ===================================================

function listPlaylistsEnableDeleteForm(params) {
	listCommonEnableDeleteForm(params);
}

// Playlist edit functions ====================================================

function playlistEditEnableEditForm(params) {
	var form = params['form_id'];
	var publicInfoContainer = params['public_info_container_id'];

	var validateDescription = params['validate_description'];
	var validateTags = params['validate_tags'];
	var validateCategories = params['validate_categories'];

	var maxCategories = params['max_categories'];
	if (!maxCategories) {
		maxCategories = 3;
	}

	if (commonValidId(form)) {
		var visibilitySwitchers = commonGet(form)['is_private'];
		var isPrivate = true;
		if (visibilitySwitchers && visibilitySwitchers.length) {
			for (var i = 0; i < visibilitySwitchers.length; i++) {
				visibilitySwitchers[i].onclick = function() {
					if (this.value == 0) {
						commonShow(publicInfoContainer);
						isPrivate = false;
					} else {
						commonHide(publicInfoContainer);
						isPrivate = true;
					}
				};
				if (visibilitySwitchers[i].checked) {
					isPrivate = visibilitySwitchers[i].value != 0;
				}
			}
		}

		commonGet(form).onsubmit = function() {
			var errorField = null;
			if (!commonValidateRequired(this, 'title', 'error_1')) {
				errorField = (errorField ? errorField : 'title');
			}
			if (!isPrivate) {
				if (validateDescription) {
					if (!commonValidateRequired(this, 'description', 'error_1')) {
						errorField = (errorField ? errorField : 'description');
					}
				}
				if (validateTags) {
					if (!commonValidateRequired(this, 'tags', 'error_1')) {
						errorField = (errorField ? errorField : 'tags');
					}
				}
				if (validateCategories && !commonValidateRequiredList(this, 'category_ids', 'error_1')) {
					errorField = (errorField ? errorField : 'category_ids[]');
				} else if (!commonValidateMaxLengthList(this, 'category_ids', maxCategories, 'error_2')) {
					errorField = (errorField ? errorField : 'category_ids[]');
				}
			}
			if (errorField) {
				if (this[errorField].length) {
					this[errorField][0].focus();
				} else {
					this[errorField].focus();
				}
			}
			return !errorField;
		};
	}
}

// Member profile view functions ==============================================

var memberProfileViewAddToFriendStorage = null;
var memberProfileViewSendMessageStorage = null;

function memberProfileViewTriggerBlock(storage, hide) {
	if (storage['visible'] || hide) {
		commonHide(storage['blockId']);
	} else {
		commonShow(storage['blockId']);
	}
	var st1 = (storage['visible'] ? 'collapse_link' : 'expand_link');
	var st2 = (!storage['visible'] && !hide ? 'collapse_link' : 'expand_link');
	if (hide) {
		storage['visible'] = false;
	} else {
		storage['visible'] = !storage['visible'];
	}
	var link = commonGet(storage['linkId']);
	if (link.className.indexOf(st1) >= 0) {
		link.className = link.className.replace(st1, st2);
	}
}

function memberProfileViewEnableAddToFriend(params) {
	var atfLink = params['link_id'];
	var atfBlock = params['block_id'];
	memberProfileViewAddToFriendStorage = {visible: false, linkId: atfLink, blockId: atfBlock};

	if (commonValidId(atfLink)) {
		commonGet(atfLink).onclick = function() {
			if (memberProfileViewSendMessageStorage) {
				memberProfileViewTriggerBlock(memberProfileViewSendMessageStorage, true);
			}
			memberProfileViewTriggerBlock(memberProfileViewAddToFriendStorage, false);
			return false;
		};
	}
}

function memberProfileViewEnableSendMessage(params) {
	var form = params['form_id'];
	var smLink = params['link_id'];
	var smBlock = params['block_id'];
	memberProfileViewSendMessageStorage = {visible: false, linkId: smLink, blockId: smBlock};

	if (commonValidId(smLink)) {
		commonGet(smLink).onclick = function() {
			if (memberProfileViewAddToFriendStorage) {
				memberProfileViewTriggerBlock(memberProfileViewAddToFriendStorage, true);
			}
			memberProfileViewTriggerBlock(memberProfileViewSendMessageStorage, false);
			return false;
		};
	}

	if (commonValidId(form)) {
		commonGet(form).onsubmit = function() {
			var errorField = null;
			if (!commonValidateRequired(this, 'message', 'error_1')) {
				errorField = (errorField ? errorField : 'message');
			}
			if (errorField) {
				this[errorField].focus();
			}
			return !errorField;
		};
	}
}

function memberProfileViewEnableDeleteConfirm(params) {
	var form = params['form_id'];
	var button = params['button_id'];
	var confirmationText = params['confirmation_text'];
	if (commonValidId(form)) {
		commonGet(form).onsubmit = function() {
			if (confirmationText) {
				return confirm(confirmationText);
			}
			return true;
		};
	}
	if (commonValidId(button)) {
		commonGet(button).onclick = function() {
			if (commonValidId(form)) {
				if (confirmationText && confirm(confirmationText)) {
					commonGet(form).submit();
				}
			}
		}
	}
}

// List members functions =====================================================

function listMembersEnableDeleteForm(params) {
	listCommonEnableDeleteForm(params);
}

// List DVDs functions ===================================================

function listDVDsEnableDeleteForm(params) {
	listCommonEnableDeleteForm(params);
}

// List albums functions ======================================================

function listAlbumsEnableDeleteForm(params) {
	listCommonEnableDeleteForm(params);
}

// List content functions =====================================================

function listContentEnableDeleteForm(params) {
	listCommonEnableDeleteForm(params);
}

// List messages functions ====================================================

function listMessagesEnableFriends(params) {
	var confirmButton = params['confirm_button_id'];
	var rejectButton = params['reject_button_id'];
	var messageFrom = params['message_from_user_id'];

	if (commonValidId(confirmButton)) {
		commonGet(confirmButton).onclick = function() {
			window.location = '?action=confirm_add_to_friends&message_from_user_id=' + messageFrom;
			return false;
		};
	}
	if (commonValidId(rejectButton)) {
		commonGet(rejectButton).onclick = function() {
			window.location = '?action=reject_add_to_friends&message_from_user_id=' + messageFrom;
			return false;
		};
	}
}

function listMessagesEnableDeleteForm(params) {
	listCommonEnableDeleteForm(params);
}

// Message details functions ==================================================

function messageDetailsEnableSendMessage(params) {
	var form = params['form_id'];

	if (commonValidId(form)) {
		commonGet(form).onsubmit = function() {
			var errorField = null;
			if (!commonValidateRequired(this, 'message', 'error_1')) {
				errorField = (errorField ? errorField : 'message');
			}
			if (errorField) {
				this[errorField].focus();
			}
			return !errorField;
		};
	}
}

// List members blog functions ================================================

function listMembersBlogEnableDeleteForm(params) {
	listCommonEnableDeleteForm(params);
}

function listMembersBlogEnableAddEntry(params) {
	var form = params['form_id'];

	if (commonValidId(form)) {
		commonGet(form).onsubmit = function() {
			var errorField = null;
			if (!commonValidateRequired(this, 'entry', 'error_1')) {
				errorField = (errorField ? errorField : 'entry');
			}
			if (errorField) {
				this[errorField].focus();
			}
			return !errorField;
		};
	}
}

// List subscriptions functions ===================================================

function listMembersSubscriptionsEnableDeleteForm(params) {
	listCommonEnableDeleteForm(params);
}

// Community function =========================================================

function ktSystemAddToFriends(user_id, message, callback) {
	commonSendRequestTxt('?mode=async&action=add_to_friends&rand=' + new Date().getTime(), 'user_id=' + encodeURIComponent(user_id) + '&message=' + encodeURIComponent(message), true, function(result) {
		callback(result);
	});
}

function ktSystemSubscribeToUser(user_id, callback) {
	commonSendRequestTxt('?mode=async&action=subscribe&subscribe_user_id=' + encodeURIComponent(user_id) + '&rand=' + new Date().getTime(), null, false, function(result) {
		callback(result);
	});
}

function ktSystemSubscribeToChannel(channel_id, callback) {
	commonSendRequestTxt('?mode=async&action=subscribe&subscribe_dvd_id=' + encodeURIComponent(channel_id) + '&rand=' + new Date().getTime(), null, false, function(result) {
		callback(result);
	});
}

function ktSystemSubscribeToModel(model_id, callback) {
	commonSendRequestTxt('?mode=async&action=subscribe&subscribe_model_id=' + encodeURIComponent(model_id) + '&rand=' + new Date().getTime(), null, false, function(result) {
		callback(result);
	});
}

function ktSystemSubscribeToCS(cs_id, callback) {
	commonSendRequestTxt('?mode=async&action=subscribe&subscribe_cs_id=' + encodeURIComponent(cs_id) + '&rand=' + new Date().getTime(), null, false, function(result) {
		callback(result);
	});
}

function ktSystemUnsubscribeFromUser(user_id, callback) {
	commonSendRequestTxt('?mode=async&action=unsubscribe&unsubscribe_user_id=' + encodeURIComponent(user_id) + '&rand=' + new Date().getTime(), null, false, function(result) {
		callback(result);
	});
}

function ktSystemUnsubscribeFromChannel(channel_id, callback) {
	commonSendRequestTxt('?mode=async&action=unsubscribe&unsubscribe_dvd_id=' + encodeURIComponent(channel_id) + '&rand=' + new Date().getTime(), null, false, function(result) {
		callback(result);
	});
}

function ktSystemUnsubscribeFromModel(model_id, callback) {
	commonSendRequestTxt('?mode=async&action=unsubscribe&unsubscribe_model_id=' + encodeURIComponent(model_id) + '&rand=' + new Date().getTime(), null, false, function(result) {
		callback(result);
	});
}

function ktSystemUnsubscribeFromCS(cs_id, callback) {
	commonSendRequestTxt('?mode=async&action=unsubscribe&unsubscribe_cs_id=' + encodeURIComponent(cs_id) + '&rand=' + new Date().getTime(), null, false, function(result) {
		callback(result);
	});
}

// Member online status functions =============================================

var ktSystemRefreshOnlineStatusImage = new Image();

function ktSystemRefreshOnlineStatus() {
	ktSystemRefreshOnlineStatusImage.src = '?mode=async&action=js_online_status&rand=' + new Date().getTime();
}

ktSystemRefreshOnlineStatus();
setInterval('ktSystemRefreshOnlineStatus()', 80 * 1000);
