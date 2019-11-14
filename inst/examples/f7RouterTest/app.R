library(shiny)
library(shinyMobile)

shiny::shinyApp(
  ui = f7Page(
    title = "My app",
    f7SingleLayout(
      navbar = f7Navbar(
        title = "Single Layout",
        hairline = FALSE,
        shadow = TRUE
      ),
      toolbar = f7Toolbar(
        position = "bottom",
        #f7Link(label = "Link 1", src = "/test/"),
        f7Link(label = "Go!", src = "/test/")
      ),
      # main content
      tags$script(
        "$(function() {
          const nav0 = $('.navbar')[0];
          $('#test').on('click', function() {
            $(nav0).hide();
            Shiny.setInputValue('back', false);
          });
          $('.link.back').on('click', function() {
            Shiny.setInputValue('back', true);
            $(nav0).show();
          });
          $('#goRouter').on('click', function() {
            console.log('router on');
            Shiny.initializeInputs(document);
            Shiny.bindAll(document);
          });
        });
        "
      ),
      f7Shadow(
        intensity = 10,
        hover = TRUE,
        f7Card(
          title = "Card header",
          sliderInput("obs", "Number of observations", 0, 1000, 500),
          plotOutput("distPlot"),
          footer = tagList(
            f7Button(color = "blue", label = "My button", src = "https://www.google.com"),
            f7Badge("Badge", color = "green")
          )
        )
      ),
      a(
        id = "goRouter",
        href = "/test/",
        `data-transition` = "f7-cover",
        "Go!"
      ),
      f7Button(inputId = "test", label = "Go to test") %>% tagAppendAttributes(`data-transition` = "f7-cover"),
      conditionalPanel(
        condition = "output.view === 'test'",
        #htmlTemplate("www/test.html")
        shiny::tags$div(
          class = "page",
          f7Navbar(title = "f7SmartSelect", mainNav = FALSE),
          shiny::tags$div(
            class = "page-content",
            style="background-color: gainsboro;",
            f7SmartSelect(
              inputId = "variable",
              label = "Choose a variable:",
              selected = "drat",
              choices = colnames(mtcars)[-1],
              type = "popup"
            ),
            tableOutput("data")
          )
        )
      )
    )
  ),
  server = function(input, output, session) {

    observe(print(input$back))

    observeEvent(input$test, updateQueryString("?page=test", mode = "push"))
    observeEvent(input$back, updateQueryString("?page=index", mode = "push"))
    output$view <- subpage <- reactive({
      query <- getQueryString()
      if (identical(query, list())) {
        updateQueryString("?page=index", mode = "push")
        return()
      }
      query$page
    })

    outputOptions(output, "view", suspendWhenHidden = FALSE)
    observe(print(input$variable))
    output$distPlot <- renderPlot({
      hist(rnorm(input$obs))
    })
    output$data <- renderTable({
      mtcars[, c("mpg", input$variable), drop = FALSE]
    }, rownames = TRUE)
    outputOptions(output, "data", suspendWhenHidden = FALSE)

    observe(print(input$toggle))
    output$test <- renderPrint(input$toggle)
    outputOptions(output, "test", suspendWhenHidden = FALSE)

  }
)
