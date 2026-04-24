from django.db import connection
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class SQLConsoleView(APIView):
    """Admin-only endpoint to execute raw SQL queries."""
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def post(self, request):
        sql = request.data.get("sql", "").strip()
        if not sql:
            return Response(
                {"error": "No SQL provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with connection.cursor() as cursor:
                cursor.execute(sql)

                if cursor.description:
                    columns = [col.name for col in cursor.description]
                    rows = cursor.fetchall()
                    return Response({
                        "columns": columns,
                        "rows": [list(row) for row in rows],
                        "row_count": len(rows),
                    })
                else:
                    return Response({
                        "columns": [],
                        "rows": [],
                        "row_count": cursor.rowcount,
                        "message": f"Query executed successfully. {cursor.rowcount} row(s) affected.",
                    })
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
