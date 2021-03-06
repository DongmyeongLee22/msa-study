import {requestDeleteComment, saveComment, modifyComment} from "../apis/comment_api";


const state = {
    comment: {id: '', parentId: '', parentName: '', boardId: '', content: '',},
    dialog: false,
    isLast: false,
    commentList: [],
};

const mutations = {
    OPEN_COMMENT_MODAL(state, comment) {
        state.comment = comment;
        state.dialog = true;
    },
    CLOSE_COMMENT_MODAL(state) {
        state.dialog = false;
    },
    SET_COMMENT_LIST(state, commentList) {
        state.commentList = commentList.content.reverse();
        state.isLast = commentList.last;
    },
    ADD_COMMENT_LIST(state, commentList) {
        let addCommentList = commentList.content.reverse();
        state.commentList = addCommentList.concat(state.commentList);
        state.isLast = commentList.last;
    },
    SUCESS_SAVE_COMMENT(state, savedComment) {
        state.commentList = state.commentList.concat(savedComment);
        state.dialog = false;
    },
    SUCESS_MODIFY_COMMENT(state) {
        state.dialog = false;
    }
};



const actions = {
    async SAVE_COMMENT(context, comment) {
        try {
            const response = await saveComment(comment);
            context.commit('SUCESS_SAVE_COMMENT', response.data);
            context.commit('SET_SNACKBAR', {text: '댓글 작성 성공!', color: 'info', location: 'bottom'});
            return response.data;
        } catch (e) {
            context.commit('OPEN_MODAL', {
                title: '댓글 작성 실패.',
                content: `댓글 작성에 실패했습니다.` + e,
                option1: '닫기',
            });
            return Promise.reject(e);
        }
    },
    async MODIFY_COMMENT(context, comment) {
        try {
            const response = await modifyComment(comment);
            context.commit('SUCESS_MODIFY_COMMENT');
            context.commit('SET_SNACKBAR', {text: '댓글 수정 성공!', color: 'info', location: 'bottom'});
            return response.data;
        } catch (e) {
            context.commit('OPEN_MODAL', {
                title: '댓글 작성 실패.',
                content: `댓글 작성에 실패했습니다.` + e,
                option1: '닫기',
            });
            return Promise.reject(e);
        }
    },

    async DELETE_COMMENT(context, id) {
        try {
            const response = await requestDeleteComment(id);
            context.commit('CLOSE_MODAL');
            context.commit('SET_SNACKBAR', {text: '댓글 삭제 성공!', color: 'info', location: 'bottom'});
            return response.data;
        } catch (e) {
            alert(e, e.response);
            return Promise.reject(e);
        }
    },
    async QUERY_SAME_PARENT_COMMENTS(context, payload) {
        try {
            const response = await querySamParentComments(payload);
            return response.data;
        } catch (e) {
            alert(e, e.response);
            return Promise.reject(e);
        }
    },
};
export default {mutations, state, actions};