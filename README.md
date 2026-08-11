# bollinger-bands-script

script to pull historical data and determine touches after applyin bollinger band algo

## what it does

-  we first fetch instruments file and then historical data 
-  calculates bollinger bands 
- prints out when close price touched/crossed the upper or lower band

 we do not hit upstocks every time we do use redis for write through cache 

## setup

need mongo and redis running, commands below:

```
docker-compose up -d
```

then install deps:

```
pnpm install
```

copy `.env.example` to `.env` and add your upstox access token:

```
UPSTOX_ACCESS_TOKEN=your_token_here
```

## usage example

```
pnpm start --symbol=INFY --from=01-07-2025 --to=31-07-2025
```


