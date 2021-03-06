## 测试框架Jest

### 1. 快速开始
#### 安装jest
```
npm install --save-dev jest
```

我们先写一个测试函数，有两个数字参数做加法，首先，创建`sum.js`文件
```
function sum(a, b) {
  return a + b
}
module.exports = sum
```

然后，创建创建`sum.test.js`,包含我们目前的测试代码。
```
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

然后添加片段到package.json中
```
{
  "scripts": {
    "test": "jest"
  }
}
```
最后运行`npm test`,jest输入如下内容

```
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

你刚刚成功的编写了一个jest测试！

这个测试用例使用了`expect`和`toBe`进行两个值相同的测试。想要学习更多的关于jest测试，请参考 [Using Matchers][1]


#### 从命令行运行
你也可以直接从命令行执行，可以输入一些有空的参数（npm install jest -g）。

Here's how to run Jest on files matching my-test, using config.json as a configuration file and display a native OS notification after the run:
```
jest my-test --notify --config=config.json
```

如果你想学习更多的命令行执行，请参考 [Jest CLI Options][2]


#### 附加配置
** 使用 Babel:**
安装`babel-jest` 和 `regenerator-runtime` 包:
```
npm install --save-dev babel-jest regenerator-runtime
```
*注意: 如果你使用npm 3或者npm 4，你不用指明安装`regenerator-runtime`。*

添加一份`.babelrc`文件到你的工程根目录，比如，如果你使用es6或者react.js需要使用`babel-preset-es2015`和`babel-preset-react`预设：
```
{
  "presets": ["es2015", "react"]
}
```
这样你会使用es6与react所有指定的语法。

*注意: 如果你使用更多的babel编译配置，请使用`babel's env option`,记住jest将会自动定义node_env作为测试。*

**使用webpack**

jest可以实用在工程内使用webpack管理你的资产,样式和编辑。webpack 提供一些特别的功能相比于其他工具。更多资料请参考 [webpack guide][3]

### 2. 使用匹配

#### 普通匹配

jest使用`matchers`让你通过不同的方法测试值。你需要熟记很多不同的`matchers`。这里只介绍最常用的`matchers`。

最简单的测试值相等的是精确相等：
```
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
```

上段代码，`expect(2 + 2)`返回一个“期待”对象。除了调用`matchers`，关于期待对象你不需要做太多。在这段代码中，`.toBe(4)`是一个matcher。当jest运行时，将追踪所有失败的`matchers`，所以它可以精确的打印错误信息。

`toBe`使用`===`精确等于测试。如果你想深度测试对象相等，使用`toEqual`代替。
```
test('object assignment', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});
```
`toEqual` 递归的查找每个字段对比是否相等。

你可以使用`not`去测试`matcher`的反面：
```
test('adding positive numbers is not zero', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});
```

#### 类型判断

有时候你需要判断undefined,null与false，但有时候你不需要明确的区分他们。jest包含工具明确的区分他们。

- toBeNull matches only null
- toBeUndefined matches only undefined
- toBeDefined is the opposite of toBeUndefined
- toBeTruthy matches anything that an if statement treats as true
- toBeFalsy matches anything that an if statement treats as false

举个例子：
```
test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
```

你可以使用这些`matcher`做精确的匹配。

#### 数字
多种途径比较数字
```
test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe and toEqual are equivalent for numbers
  expect(value).toBe(4);
  expect(value).toEqual(4);
});
```

你可以使用`toBeCloseTo`进行浮点比较
```
test('adding floating point numbers', () => {
  const value = 0.1 + 0.2;
  expect(value).not.toBe(0.3);    // 浮点数不会直接相等
  expect(value).toBeCloseTo(0.3); // 使用closeTo方法进行浮点数字比较
});
```

#### 字符串
你可以使用`toMatch`测试正则表达式来验证string字符串
```
test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});
```
#### 数组
你可以检验数组是否包含某一个特别项
```
const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'beer',
];

test('the shopping list has beer on it', () => {
  expect(shoppingList).toContain('beer');
});
```
#### 表达式
你可以使用`toThrow`来检验函数是否抛出异常
```
function compileAndroidCode() {
  throw new ConfigError('you are using the wrong JDK');
}

test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(ConfigError);

  // You can also use the exact error message or a regexp
  expect(compileAndroidCode).toThrow('you are using the wrong JDK');
  expect(compileAndroidCode).toThrow(/JDK/);
});
```
#### 更多
这是一个just尝试，查看完整的`matchers`列表[renerence docs][4]。

一旦你掌握了一个可用的`matcher`,建议下一步学习jest如何检验[异步代码][5]

### 3.测试异步代码
js运行异步代码是很普遍的。`jest`需要知道什么时候代码测试已完成，才能移动到下一个测试。`jest`有几种方法处理。

#### Callbacks
最普遍的异步是通过回调函数。

比如，如果你调用`fetchData(callback)`函数去拉取异步数据并且结束时候调用`callback(data)`。你要测试的数据是否等于`peanut buter`。

默认情况下，`Jest`走完测试代码就完成测试。这意味着测试不能按期进行。
```
// Don't do this!
test('the data is peanut butter', () => {
  function callback(data) {
    expect(data).toBe('peanut butter');
  }

  fetchData(callback);
});
```
问题在于测试工作将在`fetchData`结束的时候，也就是在回调函数之前结束。

为了解决这个问题，这是另一种形式。使用参数`done`来代替无参函数。`Jest`将会延迟测试直到`done`回调函数执行完毕。

```
test('the data is peanut butter', done => {
  function callback(data) {
    expect(data).toBe('peanut butter');
    done();
  }

  fetchData(callback);
});
```

如果`done`一直没有调用，测试将会失败。

#### Promises
如果你使用promise,有一种简单的方法处理异步测试。你的测试代码中`Jest`返回一个`Promise`，并且等待`Promise`去`resolve`。如果`Promise`是`rejected`，测试自动失败。

比如，还是那个`fetchData`，这次使用了回调，返回一个`promise`假定`reslove`一个字符串`peanut butter`。测试代码如下：

```
test('the data is peanut butter', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter');
  });
});
```

确保返回一个Promise-如果你省略了`return`，你的测试代码将会在`fetchData`之前结束。

你也可以使用`resolves`关键字在你的`expect`代码后，然后`Jest`将会把等待状态转换成`resolve`。如果`promise`被`rejected`，测试自动失败。

```
test('the data is peanut butter', () => {
  return expect(fetchData()).resolves.toBe('peanut butter');
});
```

#### Async/Await
如果你使用`async/await`，你可以完美嵌入测试。写一个`async`测试，仅使用`async`关键字在你的`matchers`函数前面就能通过测试。比如，还是`fetchData`这个测试方案可以写成
```
test('the data is peanut butter', async () => {
  await expect(fetchData()).resolves.toBe('peanut butter');
});
```

在这种情况下，`async/await`仅仅是个有效的`promises`样例的逻辑语法糖。

这些表单特别优秀，你可以混合使用这些在你的代码库或者单个文件中，它仅仅使你的测试变得更加简单。

### 安装与卸载
写测试的过程中，在你运行测试之前，你需要做一些初始化工作，去做一些需要测试的事情之前，并且你需要做一些结束工作，去做一些测试结束的事情。`Jest`提供了`helper`函数去处理这些工作。

#### 多测试重复初始化
如果你有很多测试有重复的工作，你可以是使用`beforeEach`与`afterEach`。

比如你有很多测试运行之前需要调用`initializeCityDatabase()`,而且测试结束 后需要调用`clearCityDatabase()`。你可以这么做：
```
beforeEach(() => {
  initializeCityDatabase();
});

afterEach(() => {
  clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```
同样的，如果你的`initializeCityDatabase`函数返回一个`promise`，你可以使用`return`返回这个函数。
```
beforeEach(() => {
  return initializeCityDatabase();
});
```

#### 一次性设置

如果你有很多测试有共同的重复的工作，并且重复的工作只在测试开始与测试结束的地方运行一次，你可以是使用`beforeAll`与`beforeAll`。

比如你有一个测试开始之前要调用`initializeCityDatabase()`,而且测试结束 后需要调用`clearCityDatabase()`。你可以这么做：
```
beforeAll(() => {
  return initializeCityDatabase();
});

afterAll(() => {
  return clearCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});
```

### 范围
默认情况下,`before`与`after`会对文件的每个测试生效。如果你只想对某些测试生效，你可以使用`describe`块。 `before`与`after`仅仅会在声明块中运行。

比如，我们不仅需要城市初始化，还需要食物初始化，我们可以对不同的测试做不同的初始化。
```
// Applies to all tests in this file
beforeEach(() => {
  return initializeCityDatabase();
});

test('city database has Vienna', () => {
  expect(isCity('Vienna')).toBeTruthy();
});

test('city database has San Juan', () => {
  expect(isCity('San Juan')).toBeTruthy();
});

describe('matching cities to foods', () => {
  // Applies only to tests in this describe block
  beforeEach(() => {
    return initializeFoodDatabase();
  });

  test('Vienna <3 sausage', () => {
    expect(isValidCityFoodPair('Vienna', 'Wiener Schnitzel')).toBe(true);
  });

  test('San Juan <3 plantains', () => {
    expect(isValidCityFoodPair('San Juan', 'Mofongo')).toBe(true);
  });
});
```

#### 建议
如果你仅仅想测试一个测试用例，或者跨过某个测试用例，你可以使用`fit`与`xit`。

```
fit('this will be the only test that runs', () => {
  expect(true).toBe(false);
});

xit('this will be the only test that runs', () => {
  expect(true).toBe(false);
});

test('this test will not run', () => {
  expect('A').toBe('A');
});
```



  [1]: http://facebook.github.io/jest/docs/using-matchers.html
  [2]: https://facebook.github.io/jest/docs/cli.html
  [3]: http://facebook.github.io/jest/docs/webpack.html
  [4]: http://facebook.github.io/jest/docs/expect.html
  [5]: http://facebook.github.io/jest/docs/asynchronous.html