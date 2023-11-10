  function Validator(options) {
      function GetParent(Element,Selector){
            while(Element.parentElement){
                  if(Element.parentElement.matches(Selector)){
                        return Element.parentElement
                  }
                  Element = Element.parentElement
            }
      }
      let RulesSelect = {}
      function Validate(InputElement,rule){
            let MessageElement = GetParent(InputElement,options.form_group_selector).querySelector(options.Errormessage)
            let Error;
            let rules = RulesSelect[rule.select]

            for(let i  = 0; i < rules.length; ++i){
                  switch(InputElement.type){
                        case 'radio':
                        case 'checkbox':
                              Error = rules[i](Form.querySelector(rule.select + ':checked')) 
                              break
                        default:
                              Error = rules[i](InputElement.value)
                  }
                  if(Error) break
            }            
                  if(Error){
                        MessageElement.innerText = Error
                        GetParent(InputElement,options.form_group_selector).classList.add('invalid')
                  }else{
                        MessageElement.innerText = ''
                        GetParent(InputElement,options.form_group_selector).classList.remove('invalid')
                  }
                  return !Error
            }
      function OnInput(InputElement){
            let MessageElement = GetParent(InputElement,options.form_group_selector).querySelector(options.Errormessage) 
            MessageElement.innerText = ''
            GetParent(InputElement,options.form_group_selector).classList.remove('invalid')
      }
      let Form = document.querySelector(options.form)
      if(Form){
            Form.onsubmit = function(e){
                  e.preventDefault()

                  let FormSuccess = true
                  options.rules.forEach(function(rule){
                        let inputElement = Form.querySelector(rule.select)
                        let isSuccess = Validate(inputElement,rule)
                        if(!isSuccess){
                              FormSuccess = false
                        }
                  })
                  if(FormSuccess){
                        if(typeof options.onsubmit === 'function'){
                              let enableInput = Form.querySelectorAll("[name]")
                              let formValues = Array.from(enableInput).reduce(function(values,input){
                                    switch(input.type){
                                          case 'radio':
                                                if(input.matches(':checked')){
                                                      values[input.name] = input.value
                                                }
                                                break;
                                          case 'checkbox':
                                                if(input.checked){
                                                      if(Array.isArray(values[input.name])){
                                                            values[input.name].push(input.value)
                                                      }else{
                                                            values[input.name] = [input.value]
                                                      }
                                                }
                                                if(!values[input.name]){
                                                      values[input.name] = ''
                                                }
                                                break;
                                          case 'file':
                                                values[input.name] = input.files
                                                break;
                                          default:
                                                values[input.name] = input.value
                                    }
                                    return values
                              },{})
                              options.onsubmit(formValues)
                              alert('Đăng nhập thành công')
                        }else{
                              Form.submit()
                        }
                  }
            }
            options.rules.forEach(function (rule) {
                  if(Array.isArray(RulesSelect[rule.select])){
                        RulesSelect[rule.select].push(rule.test)
                  }else{
                        RulesSelect[rule.select] = [rule.test]
                  }
                  // lấy ra inputelement 
                  let InputElements = Form.querySelectorAll(rule.select)
                  Array.from(InputElements).forEach(function (InputElement) {
                        // xử lý trường hợp blur và oninput
                        InputElement.onblur = function(){
                              Validate(InputElement,rule)
                        }
                        InputElement.onchange = function(){
                              Validate(InputElement,rule)
                        }
                        InputElement.oninput = function(){
                              OnInput(InputElement)
                        }
                  })
            })
      }
}

Validator.isRequired = function(selector,message){
      return {
            select:selector,
            test:function(value){
                  return value ? undefined : message || ' Vui lòng nhập trường này'
            }
      }
}
Validator.isEmail = function(selector,message){
      return {
            select:selector,
            test:function(value){
                  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
                  return emailRegex.test(value) ? undefined : message || 'Định dạng email không đúng'
            }
      }
}
Validator.isPassword = function(selector,min,message){
      return {
            select:selector,
            test:function(value){
                  return value.length >= min ? undefined : `Mật khẩu phải lớn hơn ${min} ký tự`
            }
      }
}

Validator.isPasswordConfirmation = function(selector,GetPasswordConfirmation,message){
      return {
            select:selector,
            test:function(value){
                  return value === GetPasswordConfirmation() ? undefined : message || 'Mật khẩu nhập lại không đúng'
            }
      }
}
Validator.isCheckSpace = function(selector,messenger){
      return {
            select:selector,
            test:function(value){
                  return value.trim() ? undefined : messenger || 'Vui lòng nhập lại trường này'
            }
      }
}
Validator.isCheck_Special_characters = function(selector,messenger){
      return {
            select:selector,
            test:function(value){
                  let check = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/
                  return check.test(value) ? undefined : messenger || 'Vui lòng nhập lại trường này'
            }
      }
}
let ShowOfHidden = [];
let icons = document.querySelectorAll('.fa.fa-eye');
let icon = document.querySelectorAll(".icon");
let input = document.querySelectorAll('.pr-20');
icon.forEach(function (item, index) {
      ShowOfHidden[index] = false;
    item.addEventListener('click', function () {
        if (!ShowOfHidden[index]) {
            icons[index].classList.remove('fa-eye');
            icons[index].classList.add('fa-eye-slash');
            input[index].type = 'text';
            ShowOfHidden[index] = true;
        } else {
            icons[index].classList.remove('fa-eye-slash');
            icons[index].classList.add('fa-eye');
            input[index].type ='password';
            ShowOfHidden[index] = false;
        }
    });
});