/*
# STEP 1

## WHAT I LEARNED

1. 함수 분리를 어떻게 할지 알았다.
2. document.querySelector를 $ 함수로 빼서 간략하게 할 수 있다는걸 알게 되었다.
3. insertAdjacentHtml, closest 같은 새로운 method를 알게 되었다.

## TODO 메뉴 추가

- [X] 메뉴의 이름을 입력받고 확인 버튼을 누르면 메뉴가 추가된다.
- [X] 메뉴의 이름을 입력받고 엔터키를 누르면 메뉴가 추가된다.
- [X] 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
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

*/

const $ = (selector) => document.querySelector(selector);

const App = () => {
  const updateMenuCount = () => {
    //   const menuCount = $("#espresso-menu-list").children.length;
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;

    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addEspressoMenuItem = () => {
    const espressoMenuName = $("#espresso-menu-name").value;

    if (espressoMenuName.trim() === "") {
      alert("값을 입력해주세요.");
      return;
    }

    const menuItemTemplate = (
      name
    ) => `<li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${name}</span>
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
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );

    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  // 분리한 이유: 나중에 코드 읽기 쉽게 하기 위해 (무슨 기능을 하는지 바로 파악 가능)
  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "수정할 메뉴 이름을 입력하세요.",
      $menuName.innerText
    );
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  };

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#espresso-menu-form").addEventListener("submit", (e) =>
    e.preventDefault()
  );

  $("#espresso-menu-submit-button").addEventListener(
    "click",
    addEspressoMenuItem
  );

  // 왜 e.target.value 안쓰고 굳이 querySelector로 하는지?
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") return;
    addEspressoMenuItem();
  });
};

App();
