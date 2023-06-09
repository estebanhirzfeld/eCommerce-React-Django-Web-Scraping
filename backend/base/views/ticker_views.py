from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Ticker

from base.serializers import TickerSerializer

@api_view(['GET'])
def get_ticker(request):
    ticker = Ticker.objects.latest('createdAt')
    serializer = TickerSerializer(ticker, many=False)
    return Response(serializer.data)