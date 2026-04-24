"""Seed categories and sample questions for development."""
from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.qa.models import Answer, Question
from apps.taxonomy.models import Category

User = get_user_model()

OFFERINGS = ["customer", "internal", "cloud", "ai-data"]

SPECIALIZATIONS: dict[str, list[str]] = {
    "customer": [
        "fullstack-development",
        "backend-development",
        "frontend-development",
        "mobile-app-development",
        "devops",
        "qa-testing",
        "ui-ux-design",
        "technical-support",
    ],
    "internal": [
        "fullstack-development",
        "backend-development",
        "frontend-development",
        "data-engineering",
        "devops",
        "infrastructure",
        "security",
        "project-management",
    ],
    "cloud": [
        "cloud-architecture",
        "cloud-migration",
        "devops",
        "infrastructure-as-code",
        "serverless",
        "container-orchestration",
        "cloud-security",
        "cost-optimization",
    ],
    "ai-data": [
        "genai-development",
        "machine-learning",
        "data-engineering",
        "data-science",
        "data-analytics",
        "mlops",
        "nlp",
        "computer-vision",
    ],
}

TOPICS: dict[str, list[str]] = {
    "fullstack-development": [
        "java",
        "python",
        "javascript",
        "typescript",
        "react",
        "angular",
        "vue-js",
        "node-js",
        "spring-boot",
        "django",
        "fastapi",
        "next-js",
        "express-js",
    ],
    "machine-learning": [
        "python",
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "keras",
        "xgboost",
        "neural-networks",
        "deep-learning",
        "model-training",
        "feature-engineering",
    ],
    "security": [
        "authentication",
        "authorization",
        "oauth",
        "jwt",
        "encryption",
        "penetration-testing",
        "security-auditing",
    ],
    "cloud-architecture": [
        "aws",
        "azure",
        "gcp",
        "terraform",
        "cloudformation",
        "architecture-design",
        "microservices",
        "serverless",
        "high-availability",
        "scalability",
    ],
}


def _display(slug: str) -> str:
    """Convert a slug like 'fullstack-development' to 'Fullstack Development'."""
    return slug.replace("-", " ").title()


SAMPLE_QUESTIONS: list[dict] = [
    {
        "category_slug": "customer.fullstack-development.react",
        "title": "Best practices for React state management in customer portals?",
        "body": (
            "We're building a customer-facing dashboard with complex nested state. "
            "Should we use Redux, Zustand, or React context for this scale? "
            "The app has ~50 routes and heavy real-time data."
        ),
    },
    {
        "category_slug": "customer.fullstack-development.django",
        "title": "How to structure Django REST API for a multi-tenant SaaS?",
        "body": (
            "We need to serve multiple customers from a single Django instance. "
            "What's the recommended approach — schema-based, row-level, or separate databases?"
        ),
    },
    {
        "category_slug": "internal.devops",
        "title": "CI/CD pipeline keeps timing out on integration tests",
        "body": (
            "Our GitHub Actions pipeline runs integration tests against a Postgres container "
            "and consistently times out after 20 minutes. The tests pass locally in 8 minutes. "
            "Any ideas on speeding this up?"
        ),
    },
    {
        "category_slug": "internal.security.jwt",
        "title": "JWT refresh token rotation — best pattern?",
        "body": (
            "We're implementing token rotation for our internal auth service. "
            "Should we store refresh tokens in an HTTP-only cookie or in-memory? "
            "What's the recommended expiry window?"
        ),
    },
    {
        "category_slug": "cloud.cloud-architecture.aws",
        "title": "ECS vs EKS for microservices deployment?",
        "body": (
            "We're migrating 12 microservices to AWS. The team is split between ECS Fargate "
            "and EKS. What are the trade-offs in terms of operational overhead, cost, "
            "and developer experience?"
        ),
    },
    {
        "category_slug": "cloud.cloud-architecture.terraform",
        "title": "Managing Terraform state across multiple AWS accounts",
        "body": (
            "We have dev, staging, and prod in separate AWS accounts. "
            "What's the best way to organize Terraform state files and modules "
            "to avoid drift and enable safe cross-account deployments?"
        ),
    },
    {
        "category_slug": "ai-data.machine-learning.pytorch",
        "title": "Fine-tuning a pre-trained transformer for classification",
        "body": (
            "I'm fine-tuning a BERT model on a small labeled dataset (~5k samples). "
            "Training loss decreases but validation accuracy plateaus at 78%. "
            "Any suggestions for regularization or data augmentation strategies?"
        ),
    },
    {
        "category_slug": "ai-data.genai-development",
        "title": "RAG pipeline latency — how to get under 2 seconds?",
        "body": (
            "Our retrieval-augmented generation pipeline takes 4-5 seconds per query. "
            "We're using pgvector for embeddings and GPT-4 for generation. "
            "Where are the typical bottlenecks and how can we reduce latency?"
        ),
    },
    {
        "category_slug": "internal.data-engineering",
        "title": "Airflow vs Prefect for internal ETL orchestration?",
        "body": (
            "We're replacing our cron-based ETL system. The team is evaluating "
            "Apache Airflow and Prefect. What are the key differences for a team of 5 "
            "data engineers maintaining ~40 DAGs?"
        ),
    },
    {
        "category_slug": "customer.frontend-development",
        "title": "Accessible form validation patterns for enterprise apps",
        "body": (
            "We need to implement WCAG 2.1 AA compliant form validation across our "
            "customer-facing app. What libraries or patterns do you recommend for "
            "React that handle aria-live regions and focus management well?"
        ),
    },
]

SAMPLE_ANSWERS: dict[str, list[str]] = {
    "Best practices for React state management in customer portals?": [
        (
            "For 50+ routes with real-time data, I'd recommend Zustand over Redux. "
            "It has a much simpler API, great TypeScript support, and built-in middleware "
            "for persistence. We switched from Redux and cut boilerplate by 60%."
        ),
        (
            "Consider a hybrid approach: React context for auth/theme state, and "
            "TanStack Query (React Query) for all server state. This eliminates "
            "most of what people use Redux for."
        ),
    ],
    "How to structure Django REST API for a multi-tenant SaaS?": [
        (
            "Row-level tenancy with a tenant_id FK on each model works best for most cases. "
            "Use a middleware to set the current tenant from the JWT/session, and create "
            "a custom manager that filters by tenant automatically."
        ),
    ],
    "ECS vs EKS for microservices deployment?": [
        (
            "ECS Fargate is significantly easier to operate if your team doesn't have "
            "deep Kubernetes experience. The cost is slightly higher per-container, but "
            "you save on DevOps headcount. EKS makes sense if you need portability or "
            "already have K8s expertise."
        ),
        (
            "We run both — ECS for simple HTTP services and EKS for workloads that need "
            "custom scheduling, GPU access, or complex networking. Don't pick one exclusively."
        ),
    ],
    "Fine-tuning a pre-trained transformer for classification": [
        (
            "With only 5k samples, try these: 1) Use a lower learning rate (2e-5), "
            "2) Add label smoothing, 3) Use gradual unfreezing — train only the classifier "
            "head first, then unfreeze transformer layers progressively."
        ),
    ],
}


class Command(BaseCommand):
    help = "Seed categories (hierarchical) and sample questions for development."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete existing categories and sample questions before seeding.",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            Question.objects.all().delete()
            Category.objects.all().delete()

        # --- Create categories ---
        created_count = 0
        for offering in OFFERINGS:
            root, c = Category.objects.get_or_create(
                name=_display(offering),
                parent=None,
                defaults={"description": f"Questions related to {_display(offering)} offerings."},
            )
            if c:
                created_count += 1

            for spec in SPECIALIZATIONS.get(offering, []):
                child, c = Category.objects.get_or_create(
                    name=_display(spec),
                    parent=root,
                    defaults={"description": f"{_display(spec)} under {_display(offering)}."},
                )
                if c:
                    created_count += 1

                for topic in TOPICS.get(spec, []):
                    _, c = Category.objects.get_or_create(
                        name=_display(topic),
                        parent=child,
                        defaults={"description": f"{_display(topic)} topic."},
                    )
                    if c:
                        created_count += 1

        self.stdout.write(self.style.SUCCESS(f"Created {created_count} categories."))

        # --- Create demo user ---
        demo_user, _ = User.objects.get_or_create(
            username="demo",
            defaults={"email": "demo@example.com", "is_active": True},
        )
        if not demo_user.has_usable_password():
            demo_user.set_password("demo1234")
            demo_user.save()

        responder, _ = User.objects.get_or_create(
            username="helper",
            defaults={"email": "helper@example.com", "is_active": True},
        )
        if not responder.has_usable_password():
            responder.set_password("helper1234")
            responder.save()

        # --- Create sample questions ---
        q_created = 0
        for item in SAMPLE_QUESTIONS:
            slug = item["category_slug"]
            try:
                category = Category.objects.get(slug=slug)
            except Category.DoesNotExist:
                self.stderr.write(f"Category slug '{slug}' not found, skipping question.")
                continue

            question, created = Question.objects.get_or_create(
                title=item["title"],
                defaults={
                    "body": item["body"],
                    "category": category,
                    "created_by": demo_user,
                },
            )
            if created:
                q_created += 1

                # Add sample answers if available
                for answer_body in SAMPLE_ANSWERS.get(item["title"], []):
                    Answer.objects.get_or_create(
                        question=question,
                        body=answer_body,
                        defaults={"created_by": responder},
                    )

        self.stdout.write(self.style.SUCCESS(f"Created {q_created} sample questions."))
        self.stdout.write(self.style.SUCCESS("Seed complete."))
