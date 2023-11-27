const apiUrl = 'http://localhost:8080';
let customerDocument;

async function getCustomer(document) {
  try {
    let response = await fetch(`${apiUrl}/customers?document=${document}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados do cliente');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function postCustomer (body) {
  try {
    let response = await fetch(`${apiUrl}/customers`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar cliente!');
    }

    return window.alert("Cliente salvo com sucesso!");
  } catch (error) {
    console.error(error);
  }
}

async function putCustomer (body) {
  try {
    let response = await fetch(`${apiUrl}/customer?document=${customerDocument}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar cliente!');
    }

    return window.alert("Cliente atualizado com sucesso!");
  } catch (error) {
    console.error(error);
  }
}

async function fillFields ()  {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const customerDocument = params.get('customer');

  if (customerDocument)
    fillFieldsWithDocument(customerDocument);  
}

function getCustomerPhoto () {
  const input = document.getElementById('customerPhoto');

  if (input.files && input.files[0]) {
    const arquivo = input.files[0];
    return arquivo.name;
  } else {
    return null;
  }
}

function cleanFields () {
  document.getElementById('nome').value = "";
  document.getElementById('CPF').value = "";
  document.getElementById('nomeSocial').value = "";
  document.getElementById('email').value = "";
  document.getElementById('telefone').value = "";
  document.getElementById('dataNascimento').value = "";
  customerDocument = "";
}

async function storeCustomer () {
  try {
    const name = document.getElementById('nome').value;
    const documentValue = document.getElementById('CPF').value;
    const socialName = document.getElementById('nomeSocial').value;
    const email = document.getElementById('email').value;
    const telephone = document.getElementById('telefone').value;
    const gender = document.querySelector('input[name="sexo"]:checked')?.value;
    const birthDate = document.getElementById('dataNascimento').value;
    
    if (!documentValue)
      return window.alert("Preencha o CPF/CNPJ do cliente");

    if (!name)
      return window.alert("Preemcha o nome do cliente");

    if (!email)
      return window.alert("Preemcha o E-mail do cliente");

    if (!telephone)
      return window.alert("Preemcha o telefone do cliente");
    
    const image = getCustomerPhoto();

    const body = {
      document: documentValue,
      name,
      socialName,
      email,
      image,
      telephone: telephone.replace(/\D/g, ''),
      gender,
      birthDate,
    }

    customerDocument ? await putCustomer(body) : await postCustomer(body);
    cleanFields();
  } catch (error) {
    throw new Error(error)
  }
}

async function fillFieldsWithDocument (document) {
  const customerData = await getCustomer(document);

  if (!customerData)
    return window.alert("Nnehum cliente registrado com esse documento.")

  customerDocument = customerData.id;
  
  document.getElementById('nome').value = customerData.name;
  document.getElementById('CPF').value = customerData.document;
  document.getElementById('nomeSocial').value = customerData.socialName;
  document.getElementById('email').value = customerData.email;
  document.getElementById('telefone').value = customerData.telephone;
  document.getElementById('dataNascimento').value = customerData.birthDate;
}

const handlePhone = (event) => {
  let input = event.target
  input.value = phoneMask(input.value)
}

const phoneMask = (value) => {
  if (!value) return ""
  value = value.replace(/\D/g,'')
  value = value.replace(/(\d{2})(\d)/,"($1) $2")
  value = value.replace(/(\d)(\d{4})$/,"$1-$2")
  return value
}

const cpfMask = () => {
  const updatedValue = document.getElementById('CPF').value.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4' );

  document.getElementById('CPF').value = updatedValue
}