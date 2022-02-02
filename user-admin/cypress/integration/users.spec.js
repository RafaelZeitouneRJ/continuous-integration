describe("Gestão de usuários", () => {
  beforeEach(() => {
    cy.exec("npm --prefix ../user-api run clear:db"); //Criei esse script para executar a limpeza
  });

  describe("Listagem", () => {
    it("contendo 1 usuário", () => {
      cy.request("POST", "http://localhost:4000/users", {
        name: "John Doe",
        email: "john@doe.com",
      }).should((response) => {
        expect(response.status).to.eq(201);
        cy.visit("/users");
        cy.get(".MuiTable-root tbody tr").should("have.length", 1);
      });
    });

    it("sem usuários", () => {
      cy.visit("/users");
      cy.contains("No User yet").should("exist");
      cy.contains("Do you want to add one?").should("exist");
      cy.contains("Create").should("exist");
    });
  });

  it("Criar um novo usuário", () => {
    // abrir formulário de cadastro
    cy.visit("/#/users");
    cy.get("a[aria-label=Create]").click();

    // preencher o formulário
    cy.get("#name").type("John Doe");
    cy.get("#email").type("john@doe.com");

    // enviar o formulário
    cy.get("button[type=submit]").click();

    // confirmação
    cy.get('a[href="#/users"]').click();
    cy.get(".MuiTable-root tbody tr").should("have.length", 1);
  });

  it("Editar um usuário", () => {
    cy.request("POST", "http://localhost:4000/users", {
      name: "John Doe",
      email: "john@doe.com",
    }).should((response) => {
      expect(response.status).to.eq(201);
      cy.visit(`#/users/${response.body.id}`);

      // verifica estado inicial do formulário
      cy.get("#name").should("have.value", "John Doe");
      cy.get("#email").should("have.value", "john@doe.com");

      // altera os dados do usuário
      cy.get("#name").clear().type("Bob Doe");
      cy.get("#email").clear().type("bob@doe.com");

      // envia os dados
      cy.get("button[type=submit]").click();

      // confirmação visual da atualização
      cy.visit(`#/users/${response.body.id}`);
      cy.get("#name").should("have.value", "Bob Doe");
      cy.get("#email").should("have.value", "bob@doe.com");
    });
  });

  describe("Remoção", () => {
    beforeEach(() => {
      cy.request("POST", "http://localhost:4000/users", {
        name: "John Doe",
        email: "john@doe.com",
      })
        .its("body")
        .as("user");
    });

    it("a partir da listagem", () => {
      cy.visit("/users");
      cy.get(".MuiTable-root tbody tr td input[type=checkbox]").click();
      cy.get("button[aria-label=Delete]").click();
      cy.wait(500);
      cy.contains("No User yet").should("exist");
      cy.contains("Do you want to add one?").should("exist");
      cy.contains("Create").should("exist");
    });

    it("a partir do formulário de edição", function () {
      const { id } = this.user;
      cy.visit(`#/users/${id}`);
      cy.get("button[aria-label=Delete]").click();
      cy.wait(500);
      cy.contains("No User yet").should("exist");
      cy.contains("Do you want to add one?").should("exist");
      cy.contains("Create").should("exist");
    });
  });
});
