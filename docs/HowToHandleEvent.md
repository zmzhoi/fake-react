# React가 이벤트를 처리하는 방식.


React는 아래 코드를 내부적으로 어떻게 처리할까?
```javascript
<div className="container" onClick={onClickContainer}>
  <button className="button" onClick={onClickButton}>
  </button>
</div>
```

아래와 같이 각 element에 이벤트 핸들러를 직접 등록한다고 생각할 수도 있다.
```javascript
document.querySelector('.container').addEventListener('click', onClickContainer);
document.querySelector('.button').addEventListener('click', onClickButton);
```

## 하지만 React에서는 이벤트를 root element 한 곳에 등록하여 `직접` 관리한다. (각 element 에 직접 등록하지 않는다.)
> 물론 focus와 같은 특정 이벤트들처럼 리액트에서 핸들링하지 않는 이벤트들도 있다. 대부분의 이벤트를 직접 관리한다고 보면 될 것 같다.)
****
```javascript
const root = document.getElementById('app');  // <- root element
ReactDom.render(<App />, root)
```

- React v16 이하에서는 document에서 모든 이벤트를 관리했다.
- 하지만 document 레벨에서 이벤트를 관리하게 되면, 서로 다른 React 앱을 중첩되게 사용하는 경우, 특정 사이트에서 일부 UI를 위해 React 를 사용하는 경우 등에서 잠재적인 이슈가 존재해서 React v17부터는 이벤트를 root element에서 관리하는 방식으로 변경되었다.
- 이벤트를 `직접` 관리한다는 의미는 이렇다. React는 NativeEvent를 wrapping 한 SyntheticEvent 객체를 정의해 놓고 이를 이용하여 이벤트를 처리한다.
- 실제로 등록한 이벤트 핸들러로 넘어오는 event 객체를 보면 nativeEvent 객체를 찾을 수 있다.


## 어떻게 root element에서 모든 이벤트를 관리하는가?

**키 포인트 몇 가지**
> 어디까지나 이해를 위한 설명으로, 실제 구현부는 훨씬 복잡한 처리가 되어 있다.

1. 먼저, root element에 React에서 관리하는 이벤트 타입별로 각각 이벤트 핸들러를 등록한다. 이렇게 하면 root element 하위 dom에서 이벤트가 발생했을 때 버블링으로 캐치할 수 있게 된다.

2. 이벤트 발생시 root element에서 해당 이벤트를 캐치하고 React 에서 관리하는 SyntheticEvent를 dispatch하기 위해 dispatchEvent 함수를 호출한다.
  
3. 이 때, dispatchEvent함수로 넘어온 target(dom)과 내부적으로 사용하는 키로 해당 target 이 어떤 Virtual-dom instance와 매칭되는지 찾는다.

4. 이벤트를 트리거한 Virtual-dom instance를 찾으면 React 내부적으로 관리하는 이벤트 리스너 queue에 enqueue 한다.
   
5. 그리고 해당 Virtual-dom instance 에서 부터 root element 까지 거슬러 올라가면서 동일한 이벤트가 등록되어 있는지를 확인하고, 발견될 때 마다 이벤트 리스너 queue에 enqueue 한다.
   
6. root element에 도착하면, 이벤트 리스너 queue에 담긴 event handler들을 순차적으로 실행한다. 

7. 이해를 위해 간단히 표현한 코드는 아래와 같다. 실제 구현부는 더욱 복잡하다. 아래 코드는 이해를 위한 코드로 보면 된다.
```javascript
const clickEventListenrQueue = []
root.addEventListener('click', onClickRoot);

function onClickRoot(event) {
  // ..생략..

  dispatchEvent(...);
}

function dispatchEvent(...) {
  // ..생략..

  let targetFiber = getTargetFiber(target);
  
  do {
    if(targetFiber.props[eventType]) {
      clickEventListenrQueue.push(targetFiber.props[eventType]);
    }
    targetFiber = getParentFiberFrom(targetFiber);
  } while(targetFiber !== root.fiber)

  let isPropagationStopped = false;
  clickEventListenrQueue.forEach(clickEventListener => {
    if(isPropagationStopped) {
      return;
    }
    clickEventListner();
  });
}
```


## 알게된 점.
- React에서 등록한 이벤트들을 어떻게 한 곳에서 관리하는지 알게 되엇다.
- 이벤트 버블 전파를 막는 방식도 알게 되었다. (`isPropagationStopped`)
- 위 설명과 코드는 버블링 이벤트에 대해서만 다뤘지만 캡처링 이벤트 또한 분리되어 구현되어 있다.


### Reference
- https://reactjs.org/
- https://blog.saeloun.com/2021/07/08/react-17-event-delagation.html
- https://blog.mathpresso.com/react-deep-dive-react-event-system-1-759523d90341