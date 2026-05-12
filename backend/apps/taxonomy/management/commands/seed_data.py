"""Seed categories and sample questions for development."""
from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.accounts.models import UserProfile
from apps.qa.models import Answer, Question
from apps.taxonomy.models import Category

User = get_user_model()

OFFERINGS = ["customer", "internal", "cloud", "ai-and-data"]

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
    "ai-and-data": [
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
    # Shared across customer/internal fullstack
    "fullstack-development": [
        "java", "python", "javascript", "typescript", "react", "angular",
        "vue-js", "node-js", "spring-boot", "django", "fastapi", "next-js",
    ],
    "backend-development": [
        "java", "python", "go", "rust", "node-js", "spring-boot", "django",
        "fastapi", "express-js", "graphql", "rest-api",
    ],
    "frontend-development": [
        "react", "angular", "vue-js", "svelte", "next-js", "tailwind-css",
        "typescript", "html-css", "web-accessibility",
    ],
    "mobile-app-development": [
        "react-native", "flutter", "swift", "kotlin", "ios", "android",
    ],
    "devops": [
        "docker", "kubernetes", "ci-cd", "github-actions", "jenkins",
        "ansible", "monitoring", "logging",
    ],
    "qa-testing": [
        "selenium", "playwright", "jest", "pytest", "cypress",
        "load-testing", "test-automation",
    ],
    "ui-ux-design": [
        "figma", "design-systems", "user-research", "prototyping",
        "accessibility", "responsive-design",
    ],
    "technical-support": [
        "troubleshooting", "documentation", "ticketing-systems",
        "knowledge-base", "customer-communication",
    ],
    "data-engineering": [
        "apache-spark", "airflow", "kafka", "dbt", "snowflake",
        "bigquery", "etl-pipelines", "data-warehousing",
    ],
    "infrastructure": [
        "linux", "networking", "dns", "load-balancing", "databases",
        "postgresql", "redis", "message-queues",
    ],
    "security": [
        "authentication", "authorization", "oauth", "jwt", "encryption",
        "penetration-testing", "security-auditing",
    ],
    "project-management": [
        "agile", "scrum", "kanban", "jira", "sprint-planning",
        "technical-debt",
    ],
    # Cloud specializations
    "cloud-architecture": [
        "aws", "azure", "gcp", "terraform", "cloudformation",
        "microservices", "high-availability", "scalability",
    ],
    "cloud-migration": [
        "lift-and-shift", "re-architecture", "hybrid-cloud",
        "data-migration", "cost-analysis",
    ],
    "infrastructure-as-code": [
        "terraform", "pulumi", "cloudformation", "ansible", "cdk",
    ],
    "serverless": [
        "aws-lambda", "azure-functions", "gcp-cloud-functions",
        "api-gateway", "event-driven",
    ],
    "container-orchestration": [
        "kubernetes", "docker-swarm", "ecs", "eks", "helm",
        "service-mesh",
    ],
    "cloud-security": [
        "iam", "vpc", "waf", "secrets-management", "compliance",
        "zero-trust",
    ],
    "cost-optimization": [
        "reserved-instances", "spot-instances", "right-sizing",
        "cost-explorer", "budgets",
    ],
    # AI and Data specializations
    "genai-development": [
        "langchain", "llm-fine-tuning", "prompt-engineering", "rag",
        "openai-api", "hugging-face", "vector-databases",
    ],
    "machine-learning": [
        "pytorch", "tensorflow", "scikit-learn", "xgboost",
        "neural-networks", "deep-learning", "feature-engineering",
    ],
    "data-science": [
        "pandas", "numpy", "jupyter", "statistical-modeling",
        "a-b-testing", "visualization",
    ],
    "data-analytics": [
        "sql", "tableau", "power-bi", "metabase", "looker",
        "data-visualization",
    ],
    "mlops": [
        "mlflow", "kubeflow", "model-serving", "experiment-tracking",
        "model-monitoring", "feature-stores",
    ],
    "nlp": [
        "transformers", "text-classification", "named-entity-recognition",
        "sentiment-analysis", "text-generation", "embeddings",
    ],
    "computer-vision": [
        "opencv", "image-classification", "object-detection", "yolo",
        "image-segmentation", "video-analysis",
    ],
}


_DISPLAY_OVERRIDES: dict[str, str] = {
    "ai-and-data": "AI and Data",
    "genai-development": "GenAI Development",
    "qa-testing": "QA Testing",
    "ui-ux-design": "UI/UX Design",
    "devops": "DevOps",
    "mlops": "MLOps",
    "nlp": "NLP",
    "ci-cd": "CI/CD",
    "aws": "AWS",
    "gcp": "GCP",
    "iam": "IAM",
    "vpc": "VPC",
    "waf": "WAF",
    "cdk": "CDK",
    "ecs": "ECS",
    "eks": "EKS",
    "dns": "DNS",
    "sql": "SQL",
    "jwt": "JWT",
    "oauth": "OAuth",
    "rest-api": "REST API",
    "graphql": "GraphQL",
    "html-css": "HTML/CSS",
    "a-b-testing": "A/B Testing",
    "dbt": "dbt",
    "etl-pipelines": "ETL Pipelines",
    "openai-api": "OpenAI API",
    "rag": "RAG",
    "llm-fine-tuning": "LLM Fine-Tuning",
    "ios": "iOS",
    "yolo": "YOLO",
    "vue-js": "Vue.js",
    "node-js": "Node.js",
    "next-js": "Next.js",
    "express-js": "Express.js",
    "tailwind-css": "Tailwind CSS",
    "react-native": "React Native",
    "spring-boot": "Spring Boot",
    "scikit-learn": "scikit-learn",
    "xgboost": "XGBoost",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "langchain": "LangChain",
    "hugging-face": "Hugging Face",
    "apache-spark": "Apache Spark",
    "power-bi": "Power BI",
    "opencv": "OpenCV",
}


def _display(slug: str) -> str:
    """Convert a slug to a display name, with special-case overrides."""
    if slug in _DISPLAY_OVERRIDES:
        return _DISPLAY_OVERRIDES[slug]
    return slug.replace("-", " ").title()


SAMPLE_QUESTIONS: list[dict] = [
    # Technical - Customer
    {
        "category_slug": "customer.fullstack-development.react",
        "title": "Best practices for React state management in customer portals?",
        "body": (
            "We're building a customer-facing dashboard with complex nested state. "
            "Should we use Redux, Zustand, or React context for this scale? "
            "The app has ~50 routes and heavy real-time data."
        ),
        "author": "charlie",
    },
    {
        "category_slug": "customer.fullstack-development.django",
        "title": "How to structure Django REST API for a multi-tenant SaaS?",
        "body": (
            "We need to serve multiple customers from a single Django instance. "
            "What's the recommended approach — schema-based, row-level, or separate databases?"
        ),
        "author": "demo",
    },
    {
        "category_slug": "customer.frontend-development",
        "title": "Accessible form validation patterns for enterprise apps",
        "body": (
            "We need to implement WCAG 2.1 AA compliant form validation across our "
            "customer-facing app. What libraries or patterns do you recommend for "
            "React that handle aria-live regions and focus management well?"
        ),
        "author": "eve",
    },
    {
        "category_slug": "customer.backend-development",
        "title": "How to handle background jobs in a customer-facing API?",
        "body": "We have long-running report generation. Should we use Celery, Django-Q, or something else?",
        "author": "charlie",
    },
    {
        "category_slug": "customer.devops",
        "title": "Tips for giving effective code reviews?",
        "body": "I just became a reviewer on my team. Any advice for giving constructive, actionable feedback?",
        "author": "charlie",
    },
    # Technical - Internal
    {
        "category_slug": "internal.devops",
        "title": "CI/CD pipeline keeps timing out on integration tests",
        "body": (
            "Our GitHub Actions pipeline runs integration tests against a Postgres container "
            "and consistently times out after 20 minutes. The tests pass locally in 8 minutes. "
            "Any ideas on speeding this up?"
        ),
        "author": "bob",
    },
    {
        "category_slug": "internal.security.jwt",
        "title": "JWT refresh token rotation — best pattern?",
        "body": (
            "We're implementing token rotation for our internal auth service. "
            "Should we store refresh tokens in an HTTP-only cookie or in-memory? "
            "What's the recommended expiry window?"
        ),
        "author": "eve",
    },
    {
        "category_slug": "internal.data-engineering",
        "title": "Airflow vs Prefect for internal ETL orchestration?",
        "body": (
            "We're replacing our cron-based ETL system. The team is evaluating "
            "Apache Airflow and Prefect. What are the key differences for a team of 5 "
            "data engineers maintaining ~40 DAGs?"
        ),
        "author": "frank",
    },
    {
        "category_slug": "internal.project-management",
        "title": "How do teams track technical debt here?",
        "body": "Is there a standard approach for logging and prioritizing tech debt across teams?",
        "author": "alice",
    },
    {
        "category_slug": "internal.infrastructure",
        "title": "What's our disaster recovery strategy?",
        "body": "If our primary region goes down, what's the expected recovery time? Do we have automated failover?",
        "author": "frank",
    },
    # Cloud
    {
        "category_slug": "cloud.cloud-architecture.aws",
        "title": "ECS vs EKS for microservices deployment?",
        "body": (
            "We're migrating 12 microservices to AWS. The team is split between ECS Fargate "
            "and EKS. What are the trade-offs in terms of operational overhead, cost, "
            "and developer experience?"
        ),
        "author": "charlie",
    },
    {
        "category_slug": "cloud.cloud-architecture.terraform",
        "title": "Managing Terraform state across multiple AWS accounts",
        "body": (
            "We have dev, staging, and prod in separate AWS accounts. "
            "What's the best way to organize Terraform state files and modules "
            "to avoid drift and enable safe cross-account deployments?"
        ),
        "author": "frank",
    },
    {
        "category_slug": "cloud.cost-optimization",
        "title": "Our AWS bill spiked 40% last month — how to debug?",
        "body": "We went from $12k to $17k/month. Where do you start investigating unexpected cost increases?",
        "author": "bob",
    },
    {
        "category_slug": "cloud.serverless",
        "title": "Cold starts killing our Lambda-based API",
        "body": "Some endpoints take 3-4 seconds on cold start. We're using Python + API Gateway. Provisioned concurrency too expensive. Alternatives?",
        "author": "eve",
    },
    # AI & Data
    {
        "category_slug": "ai-and-data.machine-learning.pytorch",
        "title": "Fine-tuning a pre-trained transformer for classification",
        "body": (
            "I'm fine-tuning a BERT model on a small labeled dataset (~5k samples). "
            "Training loss decreases but validation accuracy plateaus at 78%. "
            "Any suggestions for regularization or data augmentation strategies?"
        ),
        "author": "frank",
    },
    {
        "category_slug": "ai-and-data.genai-development",
        "title": "RAG pipeline latency — how to get under 2 seconds?",
        "body": (
            "Our retrieval-augmented generation pipeline takes 4-5 seconds per query. "
            "We're using pgvector for embeddings and GPT-4 for generation. "
            "Where are the typical bottlenecks and how can we reduce latency?"
        ),
        "author": "charlie",
    },
    {
        "category_slug": "ai-and-data.data-analytics",
        "title": "Best dashboarding tool for a small team?",
        "body": "We need a BI tool for ~10 users. Comparing Metabase, Superset, and Looker Studio. What do you recommend?",
        "author": "alice",
    },
    {
        "category_slug": "ai-and-data.data-engineering",
        "title": "dbt vs custom SQL for data transformations?",
        "body": "Our analytics team debates using dbt. The warehouse is Snowflake. Is it worth the learning curve for a team of 3?",
        "author": "bob",
    },
    {
        "category_slug": "ai-and-data.nlp",
        "title": "Choosing between OpenAI embeddings and open-source alternatives",
        "body": "We need embeddings for semantic search. OpenAI's ada-002 is easy but costly at scale. Are open-source models like E5 or BGE competitive?",
        "author": "eve",
    },
]

SAMPLE_ANSWERS: dict[str, list[dict]] = {
    "Best practices for React state management in customer portals?": [
        {
            "body": (
                "For 50+ routes with real-time data, I'd recommend Zustand over Redux. "
                "It has a much simpler API, great TypeScript support, and built-in middleware "
                "for persistence. We switched from Redux and cut boilerplate by 60%."
            ),
            "author": "frank",
        },
        {
            "body": (
                "Consider a hybrid approach: React context for auth/theme state, and "
                "TanStack Query (React Query) for all server state. This eliminates "
                "most of what people use Redux for."
            ),
            "author": "eve",
        },
    ],
    "How to structure Django REST API for a multi-tenant SaaS?": [
        {
            "body": (
                "Row-level tenancy with a tenant_id FK on each model works best for most cases. "
                "Use a middleware to set the current tenant from the JWT/session, and create "
                "a custom manager that filters by tenant automatically."
            ),
            "author": "helper",
        },
    ],
    "ECS vs EKS for microservices deployment?": [
        {
            "body": (
                "ECS Fargate is significantly easier to operate if your team doesn't have "
                "deep Kubernetes experience. The cost is slightly higher per-container, but "
                "you save on DevOps headcount. EKS makes sense if you need portability or "
                "already have K8s expertise."
            ),
            "author": "frank",
        },
        {
            "body": (
                "We run both — ECS for simple HTTP services and EKS for workloads that need "
                "custom scheduling, GPU access, or complex networking. Don't pick one exclusively."
            ),
            "author": "bob",
        },
    ],
    "Fine-tuning a pre-trained transformer for classification": [
        {
            "body": (
                "With only 5k samples, try these: 1) Use a lower learning rate (2e-5), "
                "2) Add label smoothing, 3) Use gradual unfreezing — train only the classifier "
                "head first, then unfreeze transformer layers progressively."
            ),
            "author": "eve",
        },
    ],
    "RAG pipeline latency — how to get under 2 seconds?": [
        {
            "body": (
                "Main bottlenecks: 1) Embedding generation (~200ms), 2) Vector search (~100ms), "
                "3) LLM generation (2-3s). Use streaming for generation, cache frequent queries, "
                "and consider a smaller model like GPT-3.5 for the first pass."
            ),
            "author": "charlie",
        },
    ],
    "CI/CD pipeline keeps timing out on integration tests": [
        {
            "body": "Try parallelizing tests with pytest-xdist and using a tmpfs mount for the Postgres data directory. We cut our CI from 18 min to 6 min this way.",
            "author": "frank",
        },
    ],
    "Our AWS bill spiked 40% last month — how to debug?": [
        {
            "body": "Start with Cost Explorer grouped by service, then by usage type. Most spikes are from NAT Gateway, forgotten EC2 instances, or S3 transfer costs. Enable AWS Budgets alerts.",
            "author": "helper",
        },
    ],
    "Tips for giving effective code reviews?": [
        {
            "body": "Focus on: 1) correctness, 2) clarity, 3) maintainability. Ask questions instead of making demands. Praise good patterns when you see them. Avoid nitpicking style if there's a linter.",
            "author": "eve",
        },
        {
            "body": "Time-box reviews to 30 min. If a PR is too big to review in that time, ask the author to split it.",
            "author": "bob",
        },
    ],
    "How do teams track technical debt here?": [
        {"body": "Most teams use a 'tech-debt' label in Jira/Linear and dedicate 20% of each sprint to addressing it. Some teams do quarterly 'fix-it weeks'.", "author": "charlie"},
    ],
}

# Demo users to create
DEMO_USERS = [
    {"username": "admin", "email": "admin@dih-answers.com", "password": "admin", "is_staff": True, "bio": "Platform administrator", "reputation": 100},
    {"username": "demo", "email": "demo@dih-answers.com", "password": "demo1234", "bio": "Demo user for walkthroughs", "reputation": 25},
    {"username": "helper", "email": "helper@dih-answers.com", "password": "helper1234", "bio": "Experienced team member, always happy to help", "reputation": 85},
    {"username": "alice", "email": "alice@dih-answers.com", "password": "alice1234", "bio": "Frontend engineer, React enthusiast", "reputation": 45},
    {"username": "bob", "email": "bob@dih-answers.com", "password": "bob12345", "bio": "DevOps & cloud infrastructure specialist", "reputation": 60},
    {"username": "charlie", "email": "charlie@dih-answers.com", "password": "charlie1234", "bio": "Fullstack dev, loves Django + React", "reputation": 55},
    {"username": "eve", "email": "eve@dih-answers.com", "password": "eve12345", "bio": "Security engineer & AI/ML researcher", "reputation": 70},
    {"username": "frank", "email": "frank@dih-answers.com", "password": "frank1234", "bio": "Data engineer & cloud architect", "reputation": 65},
    {"username": "newbie", "email": "newbie@dih-answers.com", "password": "newbie1234", "bio": "Just joined the company!", "reputation": 5},
]

# Patron assignments (username -> list of leaf category slugs only)
PATRON_ASSIGNMENTS = {
    "alice": [
        "customer.frontend-development.react",
        "customer.frontend-development.typescript",
        "customer.ui-ux-design.figma",
    ],
    "bob": [
        "cloud.cloud-architecture.aws",
        "cloud.cloud-architecture.terraform",
        "internal.devops.kubernetes",
        "internal.devops.docker",
    ],
    "charlie": [
        "customer.fullstack-development.django",
        "customer.fullstack-development.react",
        "ai-and-data.genai-development.rag",
        "ai-and-data.genai-development.langchain",
    ],
    "eve": [
        "internal.security.jwt",
        "internal.security.oauth",
        "ai-and-data.machine-learning.pytorch",
        "ai-and-data.nlp.transformers",
    ],
    "frank": [
        "cloud.cloud-architecture.aws",
        "cloud.cloud-architecture.gcp",
        "ai-and-data.data-engineering.apache-spark",
        "ai-and-data.data-engineering.airflow",
        "internal.data-engineering.dbt",
    ],
    "helper": [
        "customer.backend-development.java",
        "customer.backend-development.python",
        "internal.infrastructure.postgresql",
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
            Answer.objects.all().delete()
            # Delete categories from deepest level up
            while Category.objects.exists():
                leaf_categories = Category.objects.filter(children__isnull=True)
                if not leaf_categories.exists():
                    break
                leaf_categories.delete()
            Category.objects.all().delete()  # In case of cycles or something

        # --- Create categories ---
        created_count = 0
        descriptions = {

            "customer": "Questions related to customer-facing products and services.",
            "internal": "Questions about internal tools, processes, and infrastructure.",
            "cloud": "Questions about cloud architecture, migration, and operations.",
            "ai-and-data": "Questions about AI, machine learning, and data engineering.",
        }
        for offering in OFFERINGS:
            root, c = Category.objects.get_or_create(
                name=_display(offering),
                parent=None,
                defaults={"description": descriptions.get(offering, f"Questions related to {_display(offering)}.")},
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

        # --- Create demo users ---
        users = {}
        for user_data in DEMO_USERS:
            user, created = User.objects.get_or_create(
                username=user_data["username"],
                defaults={
                    "email": user_data["email"],
                    "is_active": True,
                    "is_staff": user_data.get("is_staff", False),
                },
            )
            # Always ensure password matches seed data
            user.set_password(user_data["password"])
            user.email = user_data["email"]
            user.is_staff = user_data.get("is_staff", False)
            user.save()
            UserProfile.objects.get_or_create(
                user=user,
                defaults={"bio": user_data["bio"], "reputation": user_data["reputation"]},
            )
            users[user_data["username"]] = user

        self.stdout.write(self.style.SUCCESS(f"Created/updated {len(DEMO_USERS)} demo users."))

        # --- Assign patrons ---
        for username, category_slugs in PATRON_ASSIGNMENTS.items():
            user = users.get(username)
            if not user:
                continue
            for slug in category_slugs:
                try:
                    cat = Category.objects.get(slug=slug)
                    cat.patrons.add(user)
                except Category.DoesNotExist:
                    self.stderr.write(f"Category '{slug}' not found for patron assignment.")

        self.stdout.write(self.style.SUCCESS("Assigned patrons to categories."))

        # --- Create sample questions ---
        q_created = 0
        for item in SAMPLE_QUESTIONS:
            slug = item["category_slug"]
            author_name = item.get("author", "demo")
            author = users.get(author_name, users.get("demo"))

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
                    "created_by": author,
                },
            )
            if created:
                q_created += 1

                # Add sample answers if available
                for answer_data in SAMPLE_ANSWERS.get(item["title"], []):
                    answer_author = users.get(answer_data["author"], users.get("helper"))
                    Answer.objects.get_or_create(
                        question=question,
                        body=answer_data["body"],
                        defaults={"created_by": answer_author},
                    )

        self.stdout.write(self.style.SUCCESS(f"Created {q_created} sample questions."))
        self.stdout.write(self.style.SUCCESS("Seed complete."))
