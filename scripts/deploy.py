import paramiko
import os

HOST = '47.237.113.80'
USER = 'root'
PASS = 'Fangzheng649'
REMOTE = '/www/wwwroot/fuxin-hexiang'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASS)
sftp = ssh.open_sftp()

def mkdirs(sftp, path):
    parts = path.split('/')
    for i in range(2, len(parts)+1):
        p = '/'.join(parts[:i])
        try:
            sftp.stat(p)
        except:
            sftp.mkdir(p)

count = 0
errors = []

# Upload dist/
for root, dirs, files in os.walk('dist'):
    for f in files:
        lp = os.path.join(root, f).replace('\\', '/')
        rp = lp.replace('dist', REMOTE, 1)
        try:
            mkdirs(sftp, os.path.dirname(rp))
            sftp.put(lp, rp)
            count += 1
        except Exception as e:
            errors.append(f'{lp}: {e}')

# Upload all images
for root, dirs, files in os.walk('public/images'):
    for f in files:
        lp = os.path.join(root, f).replace('\\', '/')
        rp = lp.replace('public', REMOTE, 1)
        try:
            mkdirs(sftp, os.path.dirname(rp))
            sftp.put(lp, rp)
            count += 1
        except Exception as e:
            errors.append(f'{lp}: {e}')

# Upload server.js
sftp.put('deploy/server.js', REMOTE + '/api/server.js')
count += 1

sftp.close()

# Restart services
stdin, stdout, stderr = ssh.exec_command('cd /www/wwwroot/fuxin-hexiang/api && pm2 restart fuxin-proxy && nginx -s reload')
print(stdout.read().decode())
print(stderr.read().decode())
ssh.close()

print(f'Uploaded: {count} files')
if errors:
    print(f'Errors: {len(errors)}')
    for e in errors[:5]:
        print(f'  {e}')
