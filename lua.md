# lua

## creating scope

```lua
-- other code
do -- creates new scope
  local n = 10; -- n is visible only inside this scope
  print("n = " .. n)
end -- scope ends here
-- other code
```

##  repeat until loop

repeat-until loop is same as do-while loop except the condition is opposite.

```lua
repeat
  -- do stuff
until(condition) -- if condition is true, the loop will break
```

## numeric for loop

```lua
for i=exp1,exp2[,exp3] do
  print(i)
end
```

## generic for loop

```lua
t = {}
t.ten = 10
t.ele = 11
t.twe = 12
for i,v in pairs(t) do
print(i .. ": " .. v)
end
-- output will be
-- twe: 12
-- ele: 11
-- ten: 10
```

