"""Custom email backend that sends via Mailpit's HTTP API (/api/v1/send).

This is needed because Render web services can't connect to each other's
non-HTTP ports (like SMTP 1025). The Mailpit HTTP API endpoint is accessible
via the public URL.
"""
from __future__ import annotations

import json
import urllib.request
import urllib.error

from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend


class MailpitHTTPBackend(BaseEmailBackend):
    """Send emails via Mailpit's /api/v1/send HTTP endpoint."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_url = getattr(settings, "MAILPIT_API_URL", "https://mailpit-o5ht.onrender.com")

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        sent_count = 0
        for message in email_messages:
            try:
                if self._send_message(message):
                    sent_count += 1
            except Exception:
                if not self.fail_silently:
                    raise
        return sent_count

    def _send_message(self, message) -> bool:
        """Send a single email message via Mailpit HTTP API."""
        payload = {
            "From": {"Email": message.from_email, "Name": "DIH Answers"},
            "To": [{"Email": addr, "Name": addr.split("@")[0]} for addr in message.to],
            "Subject": message.subject,
            "Text": message.body,
        }

        if message.cc:
            payload["Cc"] = [{"Email": addr} for addr in message.cc]
        if message.bcc:
            payload["Bcc"] = [{"Email": addr} for addr in message.bcc]

        data = json.dumps(payload).encode("utf-8")
        url = f"{self.api_url}/api/v1/send"

        req = urllib.request.Request(
            url,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                return resp.status == 200
        except urllib.error.URLError:
            if not self.fail_silently:
                raise
            return False
