# codeigniter 4

## namespace

- controllers must have following namespace: `namespace App\Controllers;`
- models must have following namespace: `namespace App\Models;`

## query builder

- get a query builder instance
  ```php
  <?php
  $userModel->builder();
  $userModel->builder('<table-name>');
  ```

- select one row: `$query->gerFirstRow()`
- get result: `$query->getResult()`

## select other table data in a model

```php
<?php
namespace App\Models;
class My_table extends Model {
  // ...
  public getOtherTableData() {
    $result_obj = $this->table("other_table_name")->get();
    $result = $result_obj->getResult();
    return $result;
  }
}
```

## session

- codeigniter automatically initializes the session on each page load.
- import session from `\Config\Services::session()` to use its functionality in any MVC file
  ```php
  <?php
  class MyClass {
    public function __construct() {
      $this->session = \Config\Services::session();
    }
  }
  ```
- set: `$this->session->set(["key" => value])` or `$this->session->set(key, value)`
- get: `$this->session->get(key)`

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



