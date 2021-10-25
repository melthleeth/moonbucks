const BASE_URL = "http://localhost:3000/api";

const HTTP_METHOD = {
  POST(data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  },
  PUT(data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    };
  },
  DELETE() {
    return {
      method: "DELETE",
    };
  },
};

const request = async (url, option, behavior, json = true) => {
  const response = await fetch(url, option);

  if (!response.ok) {
    alert(`${behavior} - 에러가 발생했습니다.`);
    console.error(e);
  }

  if (json) return response.json();
};

const MenuApi = {
  async getAllMenuByCategory(category) {
    return request(
      `${BASE_URL}/category/${category}/menu`,
      undefined,
      "메뉴 불러오기"
    );
  },
  async createMenu(category, name) {
    return request(
      `${BASE_URL}/category/${category}/menu`,
      HTTP_METHOD.POST({ name: name }),
      "메뉴 등록"
    );
  },
  async toggleSoldOutMenu(category, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      HTTP_METHOD.PUT(),
      "품절 toggle"
    );
  },
  async updateMenu(category, name, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.PUT({ name: name }),
      "메뉴 수정"
    );
  },
  async deleteMenu(category, menuId) {
    return request(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      HTTP_METHOD.DELETE(),
      "메뉴 삭제",
      false
    );
  },
};

export default MenuApi;
