# codeigniter 4

## 

## query builder

```php
<?php
$userModel->builder();
$userModel->builder('<table-name>');
```

## select one row

`$query->gerFirstRow()`

## session

- codeigniter automatically initializes the session on each page load.
- import session from `\Config\Services::session()` to use its functionality in any MVC file

## upgrading codeigniter version

- Controller file name should start with Capital letter
- `$query->row()` ===> `$query->gerFirstRow()`
- `$resultObject->num_rows()` ===> `$resultObject->getNumRows()`
- select query
  ```php
  <?php
	$this -> db -> select('name,address,status');
	$this -> db -> from('users');
	$this -> db -> where('user_email',  $user_email);
  ```
  ===>
  ```php
  <?php
	$this -> db -> table('users');
	  -> select('name,address,status');
	  -> where('user_email',  $user_email);
  ```



