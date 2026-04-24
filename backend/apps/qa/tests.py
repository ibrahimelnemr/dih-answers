from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from apps.taxonomy.models import Tag


class QuestionApiTests(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.user_model = get_user_model()
        self.owner = self.user_model.objects.create_user(
            username="owner",
            password="secret123",
        )
        self.other = self.user_model.objects.create_user(
            username="other",
            password="secret123",
        )
        self.admin = self.user_model.objects.create_user(
            username="admin2",
            password="secret123",
            is_staff=True,
        )

        self.root = Tag.objects.create(name="AI & Data", slug="ai-data")
        self.child = Tag.objects.create(
            name="Visualization",
            slug="visualization",
            parent=self.root,
        )
        self.leaf = Tag.objects.create(
            name="Power BI",
            slug="power-bi",
            parent=self.child,
        )
        self.inactive_leaf = Tag.objects.create(
            name="Legacy BI",
            slug="legacy-bi",
            parent=self.child,
            is_active=False,
        )

    def test_create_question_rejects_non_leaf_tag(self) -> None:
        self.client.force_authenticate(user=self.owner)

        response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "How do I build a dashboard?",
                "body": "Need help with chart setup.",
                "tag_ids": [self.child.id],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("tag_ids", response.data)

    def test_create_question_rejects_inactive_leaf_tag(self) -> None:
        self.client.force_authenticate(user=self.owner)

        response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Old BI Question",
                "body": "Should not allow inactive tag.",
                "tag_ids": [self.inactive_leaf.id],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("tag_ids", response.data)

    def test_create_question_accepts_active_leaf_tag(self) -> None:
        self.client.force_authenticate(user=self.owner)

        response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Power BI Help",
                "body": "How to configure visuals?",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)

    def test_owner_can_update_with_leaf_tag(self) -> None:
        self.client.force_authenticate(user=self.owner)
        create_response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Original",
                "body": "Body",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )

        question_id = create_response.data["id"]
        response = self.client.patch(
            reverse("question-detail", kwargs={"pk": question_id}),
            {
                "title": "Updated",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)

    def test_non_owner_cannot_update_question(self) -> None:
        self.client.force_authenticate(user=self.owner)
        create_response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Original",
                "body": "Body",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )
        question_id = create_response.data["id"]

        self.client.force_authenticate(user=self.other)
        response = self.client.patch(
            reverse("question-detail", kwargs={"pk": question_id}),
            {
                "title": "Other user update",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 403)

    def test_admin_can_update_question(self) -> None:
        self.client.force_authenticate(user=self.owner)
        create_response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Original",
                "body": "Body",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )
        question_id = create_response.data["id"]

        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            reverse("question-detail", kwargs={"pk": question_id}),
            {
                "title": "Admin update",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)

    def test_create_answer_for_question(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Need answer",
                "body": "Question body",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )
        question_id = question_response.data["id"]

        answer_response = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_id}),
            {"body": "This is an answer"},
            format="json",
        )

        self.assertEqual(answer_response.status_code, 201)
        self.assertEqual(answer_response.data["question"], question_id)

    def test_answer_owner_can_update_answer(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Need answer",
                "body": "Question body",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )
        answer_response = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_response.data["id"]}),
            {"body": "This is an answer"},
            format="json",
        )

        update_response = self.client.patch(
            reverse("answer-detail", kwargs={"pk": answer_response.data["id"]}),
            {"body": "Updated answer"},
            format="json",
        )

        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.data["body"], "Updated answer")

    def test_non_owner_cannot_update_answer(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Need answer",
                "body": "Question body",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )
        answer_response = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_response.data["id"]}),
            {"body": "This is an answer"},
            format="json",
        )

        self.client.force_authenticate(user=self.other)
        update_response = self.client.patch(
            reverse("answer-detail", kwargs={"pk": answer_response.data["id"]}),
            {"body": "Other user update"},
            format="json",
        )

        self.assertEqual(update_response.status_code, 403)

    def test_question_owner_can_accept_answer(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Need answer",
                "body": "Question body",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )

        self.client.force_authenticate(user=self.other)
        answer_response = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_response.data["id"]}),
            {"body": "Candidate answer"},
            format="json",
        )

        self.client.force_authenticate(user=self.owner)
        accept_response = self.client.post(
            reverse(
                "answer-accept",
                kwargs={
                    "question_id": question_response.data["id"],
                    "answer_id": answer_response.data["id"],
                },
            ),
            format="json",
        )

        self.assertEqual(accept_response.status_code, 200)
        self.assertTrue(accept_response.data["is_accepted"])

    def test_non_owner_cannot_accept_answer(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Need answer",
                "body": "Question body",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )

        answer_response = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_response.data["id"]}),
            {"body": "Candidate answer"},
            format="json",
        )

        self.client.force_authenticate(user=self.other)
        accept_response = self.client.post(
            reverse(
                "answer-accept",
                kwargs={
                    "question_id": question_response.data["id"],
                    "answer_id": answer_response.data["id"],
                },
            ),
            format="json",
        )

        self.assertEqual(accept_response.status_code, 403)

    def test_accepting_new_answer_switches_previous_one(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {
                "title": "Need answer",
                "body": "Question body",
                "tag_ids": [self.leaf.id],
            },
            format="json",
        )
        question_id = question_response.data["id"]

        first_answer = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_id}),
            {"body": "First answer"},
            format="json",
        )
        second_answer = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_id}),
            {"body": "Second answer"},
            format="json",
        )

        self.client.post(
            reverse(
                "answer-accept",
                kwargs={"question_id": question_id, "answer_id": first_answer.data["id"]},
            ),
            format="json",
        )
        self.client.post(
            reverse(
                "answer-accept",
                kwargs={"question_id": question_id, "answer_id": second_answer.data["id"]},
            ),
            format="json",
        )

        detail_response = self.client.get(
            reverse("question-detail", kwargs={"pk": question_id}),
            format="json",
        )
        accepted_answers = [a for a in detail_response.data["answers"] if a["is_accepted"]]

        self.assertEqual(detail_response.status_code, 200)
        self.assertEqual(len(accepted_answers), 1)
        self.assertEqual(accepted_answers[0]["id"], second_answer.data["id"])

    def test_upvote_answer_success(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {"title": "Vote question", "body": "body", "tag_ids": [self.leaf.id]},
            format="json",
        )
        answer_response = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_response.data["id"]}),
            {"body": "Vote me"},
            format="json",
        )
        self.client.force_authenticate(user=self.other)

        vote_response = self.client.post(
            reverse("answer-upvote", kwargs={"answer_id": answer_response.data["id"]}),
            format="json",
        )

        self.assertEqual(vote_response.status_code, 201)
        self.assertEqual(vote_response.data["vote_count"], 1)

    def test_upvote_answer_idempotent_error(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {"title": "Vote question", "body": "body", "tag_ids": [self.leaf.id]},
            format="json",
        )
        answer_response = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_response.data["id"]}),
            {"body": "Vote me"},
            format="json",
        )

        self.client.force_authenticate(user=self.other)
        self.client.post(
            reverse("answer-upvote", kwargs={"answer_id": answer_response.data["id"]}),
            format="json",
        )
        second_vote = self.client.post(
            reverse("answer-upvote", kwargs={"answer_id": answer_response.data["id"]}),
            format="json",
        )

        self.assertEqual(second_vote.status_code, 400)
        self.assertIn("detail", second_vote.data)

    def test_user_cannot_upvote_own_answer(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {"title": "Vote question", "body": "body", "tag_ids": [self.leaf.id]},
            format="json",
        )
        answer_response = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_response.data["id"]}),
            {"body": "Vote me"},
            format="json",
        )

        vote_response = self.client.post(
            reverse("answer-upvote", kwargs={"answer_id": answer_response.data["id"]}),
            format="json",
        )

        self.assertEqual(vote_response.status_code, 400)

    def test_question_comment_lifecycle(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {"title": "Comment question", "body": "body", "tag_ids": [self.leaf.id]},
            format="json",
        )

        create_comment = self.client.post(
            reverse("question-comment-list-create", kwargs={"question_id": question_response.data["id"]}),
            {"body": "First comment"},
            format="json",
        )

        self.assertEqual(create_comment.status_code, 201)
        comment_id = create_comment.data["id"]

        update_comment = self.client.patch(
            reverse("question-comment-detail", kwargs={"question_id": question_response.data["id"], "pk": comment_id}),
            {"body": "Updated comment"},
            format="json",
        )
        self.assertEqual(update_comment.status_code, 200)

        delete_comment = self.client.delete(
            reverse("question-comment-detail", kwargs={"question_id": question_response.data["id"], "pk": comment_id}),
            format="json",
        )
        self.assertEqual(delete_comment.status_code, 204)

    def test_answer_comment_lifecycle(self) -> None:
        self.client.force_authenticate(user=self.owner)
        question_response = self.client.post(
            reverse("question-list-create"),
            {"title": "Comment question", "body": "body", "tag_ids": [self.leaf.id]},
            format="json",
        )
        answer_response = self.client.post(
            reverse("answer-create", kwargs={"question_id": question_response.data["id"]}),
            {"body": "Answer to comment"},
            format="json",
        )

        create_comment = self.client.post(
            reverse("answer-comment-list-create", kwargs={"answer_id": answer_response.data["id"]}),
            {"body": "Answer comment"},
            format="json",
        )

        self.assertEqual(create_comment.status_code, 201)
        comment_id = create_comment.data["id"]

        update_comment = self.client.patch(
            reverse("answer-comment-detail", kwargs={"answer_id": answer_response.data["id"], "pk": comment_id}),
            {"body": "Updated answer comment"},
            format="json",
        )
        self.assertEqual(update_comment.status_code, 200)

        delete_comment = self.client.delete(
            reverse("answer-comment-detail", kwargs={"answer_id": answer_response.data["id"], "pk": comment_id}),
            format="json",
        )
        self.assertEqual(delete_comment.status_code, 204)

    def test_question_search_filters_text_and_tags(self) -> None:
        self.client.force_authenticate(user=self.owner)
        q1 = self.client.post(
            reverse("question-list-create"),
            {"title": "Power BI issue", "body": "Need help", "tag_ids": [self.leaf.id]},
            format="json",
        )
        q2 = self.client.post(
            reverse("question-list-create"),
            {"title": "Data viz question", "body": "Power BI", "tag_ids": [self.leaf.id]},
            format="json",
        )
        response = self.client.get(
            reverse("question-list-create") + "?q=issue&tag_ids=" + str(self.leaf.id),
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        ids = [item["id"] for item in response.data]
        self.assertIn(q1.data["id"], ids)
        self.assertNotIn(q2.data["id"], ids)
