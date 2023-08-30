const {postComment}  = require('../models/comments.model')

const postCommentById = (request, response, next) => {
    const { article_id } = request.params;
    const { comment, username } = request.body;

    if (!comment || !username) {
        response.status(400)
            .send({ msg: "Invalid input" });
    } else {
        postComment(article_id, username, comment)
            .then(newComment => {
                response.status(201).send({ comment: newComment[0] });
            })
            .catch(error => {
                console.error(error);
                next(error);
            });
    }
};


module.exports = { postCommentById}