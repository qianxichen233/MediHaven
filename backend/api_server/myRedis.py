import redis

myRedisServer = redis.Redis(host="localhost", port=6379, decode_responses=True)
