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
  ```php
  <?php
  $row_count = $this->builder("my_table")
    ->where("type", "some_type")
    ->get()
    ->getNumRows();
  ```
## run raw query

```php
<?php
class SomeModel extends Model {
  public function someMethod() {
    $this->table = "my_table";
    $raw_sql = "select * from users;";
    $result_obj = $this->query($raw_sql); // $this->table property needs to be set (but it will not effect this sql)
    $result = $result_obj->getResult();
  }
}
// -----------
// running raw query WITHOUT setting the `$this->table` property in model
// or runnging raw query outside a model
$db = db_connect();
$query = $this->db->query("select * from users");
$result = $query->getResult();
```

## update query

```php
<?php
class MyModel extends Model {
  public function myFunc() {
    $flag = $this->builder()
      ->where("user_id", 100)
      ->set("first_name", "Foo")
      ->set("last_name", "Bar")
      ->update(); // returns bool
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
- remove: `$this->session->remove(key)`

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

## form input

- class: `private $req;`
- constructor: `$this->req = \Config\Services::request();`
- usage: `$this->req->getVar("my_key")` - same for both `get` and `post`
- example:
  ```php
  <?php
  namespace App/Controllers;

  class MyController extends BaseController {
    private $req;
    public function __construct() {
      $this->req = \Config\Services::request();
    }
    public function myFunc() {
      const $username = $this->req->getVar("username");
      const $password = $this->req->getVar("password");
    }
  }
  ```

## uri segment (positional arguments in url)

- uri structure: `/class/method/seg1/seg2` 

- if url is: `/MyClass/myMethod/seg1/seg2` then controller method will look like:
```php
<?php
namespace App\controllers;

class MyClass extends BaseController {
  public function myMethod(seg1, seg2) {
    //  ...
  }
}
```

## loading helpers

- controller
  ```php
  <?php
  namespace App\Controllers;
  class MyController extends BaseController
  {
    protected $helpers = ["form"];
    public function index() {
      echo view("my_view);
    }
  }
  ```

- view
```php
<!-- some html here -->
<!-- we can use form_open() bellow because we loaded form helper in MyController. -->
<?php form_open(); ?>
<!-- some html here -->
```

## upgrading codeigniter version to v4

- Controller file name should start with Capital letter
- `$query->row()` ===> `$query->gerFirstRow()`
- `$resultObject->num_rows()` ===> `$resultObject->getNumRows()`
- select query
  ```php
  <?php
	$this -> db -> select('name,address,status');
	$this -> db -> from('users');
	$this -> db -> where('user_email',  $user_email);
  // ===>
	$this -> db -> table('users');
	  -> select('name,address,status');
	  -> where('user_email',  $user_email);
  ```
  ```php
  <?php
	$count = $this->db
		->where('name', $name)
		->count_all_results('employee');
  // ===>
	$count = $this->builder()
		->where('name', $name)
		->countAll();
	}
  ```
- get_where query
  ```php
  <?php
  $query = $this->db->get_where("table_name", ["some_key" => "some_value"]);
  $result = $query->result();
  // ===>
  $query = $this->builder("table_name")->where(["some_key" => "some_value"])->get();
  $result = $query->getResult();
  ```
- update query
  ```sql
  <?php
  $this->db->set('firstname','Bar');
  $this->db->where('email_id', $this->email_id);
	$this->db->update('users');
  // ===>
  $ths->builder('users') // no need to provide table name if inside same model
    ->set('firstname', 'Bar')
    ->where('email_id', $this->email_id)
    ->update();
  ```
- form input
  `$this->input->get("username")` ===> `$this->req->getVar("username")`
  `$this->input->post("username")` ===> `$this->req->getVar("username")`
- render views: `$this->load->view("my_view", $data);` ===> `echo view("my_view", $data);`
- load form helper:
  ```php
  <?php
  // inside constructor or or any function
  $this->load->helper('form');
  ```
  ===>
  ```php
  <?php
  class MyClass extends BaseController {
    protected $helpers = ["form"];
  }
  ```
- session
  - `$this->session->userdata()` ===> `$this->session->get()`
- model loading inside controller
  ```php
  <?php
  class MyController extends BaseController {
    public __construct() {
      $this->load->model("MyModel", "myModel");
    }
    public usage() {
      // $this->myModel->myFunc();
    }
  }
  ```
  ===> 
  ```php
  <?php
  class MyController extends BaseController {
    private MyModel $myModel;
    public __construct() {
      $this->myModel = model("MyModel");
    }
    public usage() {
      // $this->myModel->myFunc();
    }
  }



