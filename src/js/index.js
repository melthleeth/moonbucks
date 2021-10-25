import { $ } from "./util/dom.js";
// import store from "./store/index.js";
import MenuApi from "./api/index.js";

// 서버에 카테고리 관리하는 로직이 없어서 동적 구현은 힘들듯 ㅠ
const categoryList = [
  { name: "espresso", value: "☕ 에스프레소" },
  { name: "frappuccino", value: "🥤 프라푸치노" },
  { name: "blended", value: "🍹 블렌디드" },
  { name: "teavana", value: "🍵 티바나" },
  { name: "desert", value: "🍰 디저트" },
  // { name: "signiture", value: "🌕 시그니처" },
];

function App() {
  // 상태: 변하는 데이터이다.
  // 이 app에서 변하는 것? 메뉴 이름

  this.menu = {};
  categoryList.map((category) => (this.menu[category.name] = []));
  this.currentCategory = categoryList[0].name;

  this.init = async () => {
    // categoryList.map((category) => {
    //   if (store.getLocalStorage()) {
    //     const items = store.getLocalStorage()[category.name];
    //     if (items && items.length > 0) this.menu[category.name] = items;
    //   }
    // });
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
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

  const render = async () => {
    const menuItemTemplate = (menuItem) => {
      return `<li data-menu-id="${
        menuItem.id
      }" class="menu-list-item d-flex items-center py-2">
          <span class="${
            menuItem.isSoldOut ? "sold-out" : ""
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

    const data = await MenuApi.getAllMenuByCategory(this.currentCategory);
    this.menu[this.currentCategory] = data;

    const template = data
      .sort((o1, o2) => o1.name.localeCompare(o2.name))
      .map((menuItem) => menuItemTemplate(menuItem))
      .join("");
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    $(".menu-count").innerText = `총 ${
      this.menu[this.currentCategory].length
    }개`;
  };

  const addMenuItem = async () => {
    const menuName = $("#menu-name").value;

    const duplicatedMenu = this.menu[this.currentCategory].find(
      (menu) => menu.name.replace(/\s/g, "") === menuName.replace(/\s/g, "")
    );

    if (menuName.trim() === "") {
      alert("값을 입력해주세요.");
      return;
    }

    if (duplicatedMenu) {
      alert("이미 등록된 메뉴입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
      return;
    }

    await MenuApi.createMenu(this.currentCategory, menuName);

    render();
    $("#menu-name").value = "";
  };

  // 분리한 이유: 나중에 코드 읽기 쉽게 하기 위해 (무슨 기능을 하는지 바로 파악 가능)
  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "수정할 메뉴 이름을 입력하세요.",
      $menuName.innerText
    );

    if (updatedMenuName === null || updatedMenuName.trim() === "") {
      alert("값을 입력해주세요.");
      return;
    }

    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      //   e.target.closest("li").remove();
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  const sellOutMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (e) => {
    // const isCategoryButton = e.target.nodeName === "BUTTON";
    const isCategoryButton = e.target.classList.contains("cafe-category-name");

    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
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

    $("#menu-button-list").addEventListener("click", changeCategory);
  };
}

const app = new App();
app.init();
