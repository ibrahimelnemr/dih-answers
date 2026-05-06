"""Email notification service using Django's email backend (SMTP → Mailpit)."""
from __future__ import annotations

from django.conf import settings
from django.core.mail import send_mail


def notify_new_answer(question, answer) -> None:
    """Notify the question author that someone answered their question."""
    if question.created_by_id == answer.created_by_id:
        return  # Don't notify yourself

    subject = f"New answer on your question: {question.title}"
    body = (
        f"Hi {question.created_by.username},\n\n"
        f"{answer.created_by.username} answered your question:\n"
        f'"{question.title}"\n\n'
        f"Answer:\n{answer.body[:500]}\n\n"
        f"View it at: {settings.FRONTEND_URL}/questions/{question.id}\n"
    )
    _send(subject, body, [_user_email(question.created_by)])


def notify_question_upvote(question, voter) -> None:
    """Notify the question author that their question was upvoted."""
    if question.created_by_id == voter.id:
        return

    subject = f"Your question received an upvote: {question.title}"
    body = (
        f"Hi {question.created_by.username},\n\n"
        f"{voter.username} upvoted your question:\n"
        f'"{question.title}"\n\n'
        f"View it at: {settings.FRONTEND_URL}/questions/{question.id}\n"
    )
    _send(subject, body, [_user_email(question.created_by)])


def notify_answer_upvote(answer, voter) -> None:
    """Notify the answer author that their answer was upvoted."""
    if answer.created_by_id == voter.id:
        return

    subject = f"Your answer received an upvote"
    body = (
        f"Hi {answer.created_by.username},\n\n"
        f"{voter.username} upvoted your answer on:\n"
        f'"{answer.question.title}"\n\n'
        f"View it at: {settings.FRONTEND_URL}/questions/{answer.question_id}\n"
    )
    _send(subject, body, [_user_email(answer.created_by)])


def notify_answer_accepted(answer) -> None:
    """Notify the answer author that their answer was accepted."""
    question = answer.question
    if question.created_by_id == answer.created_by_id:
        return

    subject = f"Your answer was accepted: {question.title}"
    body = (
        f"Hi {answer.created_by.username},\n\n"
        f"{question.created_by.username} accepted your answer on:\n"
        f'"{question.title}"\n\n'
        f"Congratulations!\n\n"
        f"View it at: {settings.FRONTEND_URL}/questions/{question.id}\n"
    )
    _send(subject, body, [_user_email(answer.created_by)])


def _user_email(user) -> str:
    """Get user email, fallback to username@dih-answers.local."""
    return user.email or f"{user.username}@dih-answers.local"


def _send(subject: str, body: str, recipients: list[str]) -> None:
    """Send email, silently failing on errors to not break main flow."""
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=True,
        )
    except Exception:
        pass
