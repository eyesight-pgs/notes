# pdf

## app
linux - zathura + mupdf, atril (from MATE DE), Libre Office Draw (for editing PDF), Firefox (view + edit)
android - Librera FD (available on F-Droid)
windows - Sumatra PDF



## lock a pdf

```bash
qpdf --encrypt user_pass owner_pass 256 -- original.pdf encrypted.pdf

user_pass, owner_pass - these are passwords
Who is the User? Anyone you want to let look at the file.
Who is the Owner? The person who created the file and wants to control what people do with it.
The encryption strength (AES-256)

In qpdf, you add the --accessibility, --extract, or --print flags before the --. If you don't specify an allowed action, qpdf defaults to blocking it for the User.
--print	===> allowed values: full, low, none
--extract ===> allowed values: y or n
--modify ===> allowed values: all, annotate, form, none
```

