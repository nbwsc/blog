# deploy-redis

## see [this](https://redis.io/topics/quickstart)


### install

```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
```

```
sudo cp src/redis-server /usr/local/bin/
sudo cp src/redis-cli /usr/local/bin/
```
or `sudo make install`

### deploy properly
- Create a directory where to store your Redis config files and your data:

```
sudo mkdir /etc/redis
sudo mkdir /var/redis
```

- Copy the init script that you'll find in the Redis distribution under the utils directory into /etc/init.d. We suggest calling it with the name of the port where you are running this instance of Redis. For example:

```
sudo cp utils/redis_init_script /etc/init.d/redis_6379
```

- Edit the init script.
```
sudo vi /etc/init.d/redis_6379
```

- Copy the template configuration file you'll find in the root directory of the Redis distribution into /etc/redis/ using the port number as name, for instance:
```
sudo cp redis.conf /etc/redis/6379.conf
```

- Create a directory inside /var/redis that will work as data and working directory for this Redis instance:
```
sudo mkdir /var/redis/6379
```

- Edit the configuration file, making sure to perform the following changes:
    - Set daemonize to yes (by default it is set to no).
    - Set the pidfile to /var/run/redis_6379.pid (modify the port if needed).
    - Change the port accordingly. In our example it is not needed as the default port is already 6379.
    - Set your preferred loglevel.
    - Set the logfile to /var/log/redis_6379.log
    - Set the dir to /var/redis/6379 (very important step!)

- 
Finally add the new Redis init script to all the default runlevels using the following command:
```
sudo update-rc.d redis_6379 defaults

sudo /etc/init.d/redis_6379 start
```
