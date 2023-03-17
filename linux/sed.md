# sed

```sh
# this is normal echo printing two lines
echo -e "aa\nbb"
aa
bb

# pass this two lines to sed and delete line having "bb"
echo "aa\nbb" | sed -e "/bb/d"

# replace first matching "bb" with "cc"
echo "aa\nbbzzbb" | sed -e "s/bb/cc/"

# replace all matching "bb" with "cc"
echo "aa\nbbzzbb" | sed -e "s/bb/cc/g"

# print first 10 lines of a file
sed 10q my_file.txt
```

## saerch (find) and replace in multiple file

```sh
cd /path/to/your/folder
sed -i 's/foo/bar/g' *
```
- here `-i` stands for in place replace
- other ex: `sed -i 's/foo/bar/g' my-file.txt`

