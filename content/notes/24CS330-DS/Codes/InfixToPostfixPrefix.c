#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#define capacity 50
typedef struct stack
{
    char arr[capacity];
    int top;
} stack;
int isFull(stack *s)
{
    return s->top == capacity - 1;
}
int isEmpty(stack *s)
{
    return s->top == -1;
}
void push(stack *s, char item)
{
    if (isFull(s))
    {
        printf("Stack overflow\n");
        return;
    }
    s->arr[++(s->top)] = item;
}
char pop(stack *s)
{
    if (isEmpty(s))
    {
        printf("Stack undeflow\n");
        return ' ';
    }
    return s->arr[(s->top)--];
}
char peek(stack *s)
{
    if (isEmpty(s))
    {
        printf("Stack undeflow\n");
        return ' ';
    }
    return s->arr[(s->top)];
}
int precedence(char s)
{
    if (s == '^' || s == '$')
        return 4;
    if (s == '/' || s == '*')
        return 3;
    if (s == '+' || s == '-')
        return 2;
    else
        return 1;
}
int isOperator(char op)
{
    return (op == '$' || op == '^' || op == '*' || op == '/' || op == '+' || op == '-');
}
void infix_to_postfix(char infix[])
{
    char postfix[50];
    int j = 0;
    stack *s = (stack *)malloc(sizeof(stack));
    s->top = -1;
    for (int i = 0; infix[i] != '\0'; i++)
    {
        if (infix[i] == '(')
        {
            push(s, infix[i]);
        }
        else if (infix[i] == ')')
        {
            while (peek(s) != '(')
            {
                postfix[j] = pop(s);
                j++;
            }
            pop(s);
        }
        else if (isOperator(infix[i]))
        {
            if (!isEmpty(s) && (precedence(infix[i]) <= precedence(peek(s))))
            {
                postfix[j] = pop(s);
                j++;
            }
            push(s, infix[i]);
        }
        else
        {
            postfix[j] = infix[i];
            j++;
        }
    }
    while (!isEmpty(s))
    {
        postfix[j] = pop(s);
        j++;
    }
    postfix[j] = '\0';
    for (int i = 0; postfix[i] != '\0'; i++)
    {
        printf("%c", postfix[i]);
    }
}
void infixToPrefix(char infix[])
{
    // strrev(infix);
    char prefix[50];
    int j = 0;
    int i = 0;
    stack *s = (stack *)malloc(sizeof(stack));
    s->top = -1;
    // for (int i = 0; infix[i] != '\0'; i++)
    for (i = strlen(infix) - 1; i >= 0; i--)
    {
        if (infix[i] == ')')
        {
            push(s, infix[i]);
        }
        else if (infix[i] == '(')
        {
            while (peek(s) != ')')
            {
                prefix[j] = pop(s);
                j++;
            }
            pop(s);
        }
        else if (isOperator(infix[i]))
        {
            if (!isEmpty(s) && (precedence(infix[i]) < precedence(peek(s))))
            {
                prefix[j] = pop(s);
                j++;
            }
            push(s, infix[i]);
        }
        else
        {
            prefix[j] = infix[i];
            j++;
        }
    }
    while (!isEmpty(s))
    {
        prefix[j] = pop(s);
        j++;
    }
    prefix[j] = '\0';
    // strrev(prefix);
    // for (int i = 0; prefix[i] != '\0'; i++)
    for (int i = strlen(prefix) - 1; i >= 0; i--)
    {
        printf("%c", prefix[i]);
    }
}
void main()
{
    char infix[50];
    int len = 0;
    // char infix[] = "(A+B)*(C+D)";
    printf("Enter your expression\n");
    scanf("%s", infix);
    printf("Postfix expression : ");
    infix_to_postfix(infix);
    printf("\nPrefix expression : ");
    infixToPrefix(infix);
}