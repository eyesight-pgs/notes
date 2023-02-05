# codeigniter 4

## namespace

- controllers must have following namespace: `namespace App\Controllers;`
- models must have following namespace: `namespace App\Models;`

## rednering views

`echo view("home");`

## properties for model class

```php
<?php
namespace App\Models;
use CodeIgniter\Model;
class UserModel extends Model {
  protected $table = 'user';
  protected $primaryKey = 'user_id';
  protected $allowedFields = [
    "user_id",
    "name",
    "email",
    "address",
    "gender",
  ];
  public $user_id;
  public $name;
  public $email;
  public $address;
  public $gender;
}
```

## query builder

- get a query builder instance
  ```php
  <?php
  $userModel->builder();
  $userModel->builder('<table-name>');
  ```

- select one row: `$query->gerFirstRow()`
- get result: `$query->getResult()`
- count number of rows: `$query->countAll()`

## run raw query

```php
<?php
class SomeModel extends Model {
  public function someMethod() {
    $raw_sql = "select * from users;";
    $result_obj = $this->query($raw_sql);
    $result = $result_obj->getResult();
  }
}
```

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

## validation

```php
<?php
$validation = \Config\Services::validation();
$validation->reset();
$validation->setRules([
  'username' => "trim|required",
  'password' => "trim|required"
]);
$isValid = $validation->withRequest($this->request)->run();
```

- print validation errors to view:
```php
<?php echo \Config\Services::validation()->listErrors(); ?>
```

## redirect

`return redirect()->to('home')`


