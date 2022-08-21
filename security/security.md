# SECURITY



--> SSL security
	perfect forward secrecy

--> OpenSSL heart bleed vulnerability
	link: https://heartbleed.com/
	link: https://www.openssl.org/news/secadv/20140407.txt

	Only 1.0.1 and 1.0.2-beta releases of OpenSSL are affected
	including 1.0.1f and 1.0.2-beta1.

--> database
	create separate account for different purpose
	don't allow truncate or drop command through app login
	
--> XXS prevention
  link: https://security.stackexchange.com/questions/181282/how-can-i-prevent-xss-on-a-post-input
  XXS not about input... its about output (html output).
  alway escape while outputting to html.









