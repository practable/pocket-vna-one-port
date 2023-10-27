This is the process I went through to re-install on a fresh pvna00. There were no ansible scripts in the repo, and only one experiment need installing, so did this manually.


## calibration service

create `setup-docker.sh`:

```
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

```

Then install docker and pull the image we need
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin
sudo docker image pull practable/calibration:arm32v7-3.7-0.1
```

create calibration.service file from file in ./files
```
cd /etc/systemd/system
nano calibration.service #copy in contents and save
systemctl enable calibration.service
systemctl start calibration.service
```

## hardware
copy in other exectuable files

```
nano vna-data
chmod +x vna-data
```

repeat for socat-rfswitch, websocat-rfswitch


now create /etc/practable/data.access with contents:
```
https://relay-access.practable.io/session/pvna00-data
```



