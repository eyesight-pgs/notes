# windows

## Installing OpenSSL

```txt
Run the following command with administrative previlages
  choco install openssl -pre -y
This will install openssl on C:\Program Files\OpenSSL-Win64
Folder structure:
C:
|- Program Files
  |- OpenSSL-Win64
    |- bin (Add to env: Path)
    |- include (Add to env INCLUDE)
    |- lib (Add to env LIB)


Updating user environmental variables:
  [append] Path: C:\Program Files\OpenSSL-Win64\bin
  [create] LIB: C:\Program Files\OpenSSL-Win64\lib
  [create] INCLUDE: C:\Program Files\OpenSSL-Win64\include
```

## How to install scoop at specified location?

By default scoop is install in C:\User\<user name>\scoop

```txt
Solution:
	Open powershell
	run:
		$env:SCOOP = '<location where you want to install scoop>'
		ex:
			$env:SCOOP = 'E:\app\scoop'
	run:
		Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
		Note: the above command is taken from official scoop site: https://scoop.sh
```

## Creating shortcut for windows env window

Create a new shortcut file from rightclick menu.<br>
Add the folowing content as target:
  `C:\Windows\System32\rundll32.exe sysdm.cpl,EditEnvironmentVariables`

Note:
	It did not allow to edit system env.<br>
	But user env can be edited.




