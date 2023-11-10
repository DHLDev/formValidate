      function Validator(Form){
            function getParent(element,selector){
                  while(element.parentElement){
                        if(element.parentElement.matches(selector)){
                              return element.parentElement
                        }
                        element = element.parentElement
                  }
            }
            let formRules = {}
            let Validate = {
                  required: function(value){
                        return value ? undefined : 'Vui lòng nhập trường này'
                  },
                  email: function(value){
                        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                        return regex.test(value) ? undefined : 'Email không hợp lệ'
                  },
                  min: function(min){
                        return function(value){
                              return value.length >= min? undefined : 'Mật khẩu phải có ít nhất'+ min +'ký tự'
                        }
                  },
                  checkspace:function(value){
                        return value.trim() ? undefined : 'trường này không được để trống'
                  },
                  password_confirmation: function(value){
                        return value === document.querySelector('#password').value ? undefined : 'Mật khẩu nhập lại không đúng'
                  }
            }
            let FormElement = document.querySelector(Form)
            if(FormElement){
                  let InputElement = FormElement.querySelectorAll('[name][rules]')
                  for (let input of InputElement) {
                        let Rules = input.getAttribute('rules').split('|')
                        for (let rule of Rules) {
                              let RuleInfo;
                              let RuleHasValue = rule.includes(':')
                              if(RuleHasValue){
                                    RuleInfo = rule.split(':')
                                    rule = RuleInfo[0]
                              }
                              let RuleFunc = Validate[rule]
                              if(RuleHasValue){
                                    RuleFunc = RuleFunc(RuleInfo[1])
                              }
                              if(Array.isArray(formRules[input.name])){
                                    formRules[input.name].push(RuleFunc)
                              }else{
                                    formRules[input.name] = [RuleFunc]
                              }
                        }
                        // lắng nghe xử lý sự kiện
                        input.onblur = HandlValidate
                        input.oninput = handOnInput
                  }
                  function HandlValidate(event){
                        let rules = formRules[event.target.name]
                        let ErrorMessage;
                        for (let  rule of rules){
                              switch (event.target.type) {
                                    case 'checkbox':
                                        ErrorMessage = rule(FormElement.querySelector(`input[name="${event.target.name}"]` + ':checked'))
                                        break;
                                    case 'radio':
                                        ErrorMessage= rule(FormElement.querySelector(`input[name="${event.target.name}"]` + ':checked'))
                                        break;
                                    default:
                                        ErrorMessage = rule(event.target.value);
                                }
                                if (ErrorMessage) break;
                              // dùng khi các trường toàn thẻ input
                              // ErrorMessage = rule(event.target.value)
                              // if(ErrorMessage){
                              //       break
                              // }
                        }
            
                        if(ErrorMessage){
                              let formGroup = getParent(event.target , '.form-group')
                              if(formGroup){
                                    formGroup.classList.add('invalid')
                                    let formMessage = formGroup.querySelector('.form-message')
                                    if(formMessage){
                                          formMessage.innerText = ErrorMessage   
                                    }
                              }
                        }
                        return !ErrorMessage
                  }
                  function handOnInput(event){
                        let formGroup = getParent(event.target , '.form-group')
                        if(formGroup.classList.contains('invalid')){
                              formGroup.classList.remove('invalid')
                              let formMessage = formGroup.querySelector('.form-message')
                              if(formMessage){
                                    formMessage.innerText = ""   
                              }
                        }
                  }
                  // show password
                  let show = []
                  let icon = FormElement.querySelectorAll(".icon")
                  let inputshow = FormElement.querySelectorAll(".show-hidden")
                  icon.forEach(function(icon,index){
                        show[index] = false
                        icon.addEventListener('click', function(){
                              if(!show[index]){
                                    inputshow[index].setAttribute('type', 'text')
                                    icon.classList.remove('fa-eye')
                                    icon.classList.add('fa-eye-slash')
                                    show[index] = true
                              }else{
                                    inputshow[index].setAttribute('type', 'password')
                                    icon.classList.remove('fa-eye-slash')
                                    icon.classList.add('fa-eye')
                                    show[index] = false
                              }
                        })
                  })
            }
            FormElement.onsubmit = function(event){
                  event.preventDefault()

                  let InputElement = FormElement.querySelectorAll('[name][rules]')
                  let isFormValid = true
                  for (let input of InputElement) {
                        if(!HandlValidate({target:input})){
                              isFormValid = false
                        }
                  }
                  console.log(isFormValid)
            }
      }