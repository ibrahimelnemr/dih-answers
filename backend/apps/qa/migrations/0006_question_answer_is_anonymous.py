from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('qa', '0005_question_category_alter_question_tags_questionvote'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='is_anonymous',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='answer',
            name='is_anonymous',
            field=models.BooleanField(default=False),
        ),
    ]
