# VirtualDom


```html
<ul class=”list”>
  <li>item 1</li>
  <li>item 2</li>
</ul>
```

위에 적힌 HTML은 아래와 같은 javascript 객체로 표현할 수 있다.

```javascript
{ 
  type: 'ul', props: { 'class': 'list' }, children: [
    { type: 'li', props: {}, children: ['item 1'] },
    { type: 'li', props: {}, children: ['item 2'] }
  ]  
}
```

이게 VirtualDom 이다.

### 그렇다면, javascript파일에 JSX문법으로 작성된 HTML을 어떻게 객체로 파싱할까?

Babel이 이를 도와준다. (@babel/plugin-transform-react-jsx) 

물론, tsc도 JSX -> VirtualDom 파싱이 가능하다.





### Reference
- https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060
- https://junilhwang.github.io/TIL/Javascript/Design/Vanilla-JS-Virtual-DOM/#_2-diff-%E1%84%8B%E1%85%A1%E1%86%AF%E1%84%80%E1%85%A9%E1%84%85%E1%85%B5%E1%84%8C%E1%85%B3%E1%86%B7-%E1%84%89%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC
- https://github.com/pomber/didact
