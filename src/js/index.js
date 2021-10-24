/*
# STEP 1

## WHAT I LEARNED

1. 함수 분리를 어떻게 할지 알았다.
2. document.querySelector를 $ 함수로 빼서 간략하게 할 수 있다는걸 알게 되었다.
3. insertAdjacentHtml, closest 같은 새로운 method를 알게 되었다.

## TODO 메뉴 추가

- [X] 메뉴의 이름을 입력받고 확인 버튼을 누르면 메뉴가 추가된다.
- [X] 메뉴의 이름을 입력받고 엔터키를 누르면 메뉴가 추가된다.
- [X] 추가되는 메뉴의 아래 마크업은 `<ul id="menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
- [X] 총 메뉴 개수를 count하여 상단에 보여준다.
- [X] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
- [X] 사용자 입력값이 빈 값이라면 추가되지 않는다.

### 하고싶은 것

- [ ] 빈값이 아닐 경우 확인 버튼이 활성화된다.

## TODO 메뉴 수정

- [X] 메뉴의 수정 버튼을 누르면 메뉴를 수정할 수 있는 모달이 팝업된다.
- [X] 메뉴 수정 모달은 `prompt` 인터페이스를 활용한다.
- [X] 기존 메뉴 이름이 input field에 default value로 들어오며, 확인버튼을 누르면 메뉴가 수정된다.


## TODO 메뉴 삭제

- [X] 메뉴 삭제 버튼을 누르면 메뉴 삭제 모달이 팝업된다.
- [X] 메뉴 삭제시 브라우저에서 제공하는 `confirm` 인터페이스를 활용한다.
- [X] 확인 버튼을 누르면 메뉴가 삭제된다.
- [X] 총 메뉴 갯수를 count하여 상단에 보여준다.


# 🎯 STEP 2 요구사항 - 상태 관리로 메뉴 관리하기

## WHAT I LEARNED

1. module로 util과 store를 분리하여 코드를 깔끔하게 관리할 수 있다.
2. this keyword를 쓰려면 결국 contructor가 필요하기 때문에 fucntion을 써야 한다.
3. 혹시 나중에 메뉴 카테고리가 추가될 수 있으니 동적으로 받아오게 했다.
    - 근데 이미 html에 하드코딩 되어있어서 진짜 동적으로 하고싶으면 이부분까지 js로 렌더링하도록 수정해야할 것 같다.

## TODO localStroage Read & Write

- [X] localStorage에 데이터를 저장한다.
  - [X] 메뉴를 추가할 때
  - [X] 메뉴를 수정할 때
  - [X] 메뉴를 삭제할 때
- [X] localStorage에 있는 데이터를 읽어온다.

## TODO 카테고리별 메뉴판 관리

- [X] 메뉴 (에스프레소, 프라푸치노, 블렌디드, 티바나, 디저트)는 배열에 담아서 가져온다.
- [X] 메뉴 각각의 종류별로 메뉴판을 관리할 수 있게 만든다.

> 배열로 종류 가져와서 동적으로 가져오는게 좋아보이는데

## TODO 페이지 접근시 최초 데이터 Read & Rendering

- [ ] 페이지에 최초로 접근할 때는 localStorage에서 에스프레소 메뉴를 읽어온다.
- [ ] 에스프레소 메뉴를 페이지에 렌더링한다.

## TODO 품절 상태 관리

- [X] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 `sold-out` class를 추가하여 상태를 변경한다.
- [X] 품절 버튼을 추가한다.
- [X] 품절 버튼을 클릭시 localStorage에 상태값이 저장된다.
- [X] 품절 메뉴의 classList에 `sold-out`을 추가한다.

*/

import { $ } from "./util/dom.js";
import store from "./store/index.js";

const categoryList = [
  { name: "espresso", value: "☕ 에스프레소" },
  { name: "frappuccino", value: "🥤 프라푸치노" },
  { name: "blended", value: "🍹 블렌디드" },
  { name: "teavana", value: "🍵 티바나" },
  { name: "dessert", value: "🍰 디저트" },
  { name: "signiture", value: "🌕 시그니처" },
];

function App() {
  // 상태: 변하는 데이터이다.
  // 이 app에서 변하는 것? 메뉴 이름

  this.menu = {};
  categoryList.map((category) => (this.menu[category.name] = []));
  this.currentCategory = categoryList[0].name;

  this.init = () => {
    categoryList.map((category) => {
      if (store.getLocalStorage()) {
        const items = store.getLocalStorage()[category.name];
        if (items && items.length > 0) this.menu[category.name] = items;
      }
    });
    renderMenuButton();
    render();
    initEventListeners();
  };

  const renderMenuButton = () => {
    const menuButtonTemplate = (category) => `<button
        data-category-name="${category.name}"
        class="cafe-category-name btn bg-white shadow mx-1"
        >${category.value}</button>`;

    const template = categoryList
      .map((item) => menuButtonTemplate(item))
      .join("");
    $("#menu-button-list").innerHTML = template;
  };

  const render = () => {
    const menuItemTemplate = (menuItem, index) => {
      return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="${
            menuItem.soldOut ? "sold-out" : ""
          } w-100 pl-2 menu-name">${menuItem.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
            품절
        </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
    };

    const template = this.menu[this.currentCategory]
      .sort((o1, o2) => o1.name.localeCompare(o2.name))
      .map((menuItem, index) => menuItemTemplate(menuItem, index))
      .join("");
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    $(".menu-count").innerText = `총 ${
      this.menu[this.currentCategory].length
    }개`;
  };

  const addMenuItem = () => {
    const menuName = $("#menu-name").value;

    if (menuName.trim() === "") {
      alert("값을 입력해주세요.");
      return;
    }

    this.menu[this.currentCategory].push({ name: menuName });
    store.setLocalStorage(this.menu);

    render();
    $("#menu-name").value = "";
  };

  // 분리한 이유: 나중에 코드 읽기 쉽게 하기 위해 (무슨 기능을 하는지 바로 파악 가능)
  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "수정할 메뉴 이름을 입력하세요.",
      $menuName.innerText
    );
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      //   e.target.closest("li").remove();
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const sellOutMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        sellOutMenuName(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => e.preventDefault());

    $("#menu-submit-button").addEventListener("click", addMenuItem);

    // 왜 e.target.value 안쓰고 굳이 querySelector로 하는지?
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") return;
      addMenuItem();
    });

    $("#menu-button-list").addEventListener("click", (e) => {
      // const isCategoryButton = e.target.nodeName === "BUTTON";
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App();
app.init();
