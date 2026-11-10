#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define capacity 50
typedef struct stack
{
    char arr[capacity];
    int top;
} stack;

int isFull(stack *s)
{
    return (s->top == capacity - 1);
}

int isEmpty(stack *s)
{
    return (s->top == -1);
}

void push(stack *s, int data)
{
    if (isFull(s))
    {
        printf("Stack Overflow\n");
        return;
    }
    s->arr[(++s->top)] = data;
}

int pop(stack *s)
{
    if (isEmpty(s))
    {
        printf("Stack Underflow\n");
        return;
    }
    return s->arr[(s->top)--];
}

int isOperator(char c)
{
    if (c == '-' || c == '+' || c == '*' || c == '/')
        return 1;
    else
        return 0;
}

int giveResult(int n1, int n2, char op)
{
    if (op == '*')
        return n1 * n2;
    else if (op == '/')
        return n1 / n2;
    else if (op == '+')
        return n1 + n2;
    else if (op == '-')
        return n1 - n2;
}

int postfixEvaluation(char *postfix)
{
    int i = 0, i1, i2, result = 0;
    stack *s = (stack *)malloc(sizeof(stack));
    s->top = -1;
    for (i = 0; postfix[i] != '\0'; i++)
    {
        if (!isOperator(postfix[i]))
            push(s, postfix[i] - '0');
        else if (isOperator(postfix[i]))
        {
            i2 = pop(s);
            i1 = pop(s);
            result = giveResult(i1, i2, postfix[i]);
            push(s, result);
        }
    }
    return result;
}

int prefixEvaluation(char *prefix)
{
    int i = 0, i1, i2, result = 0;
    stack *s = (stack *)malloc(sizeof(stack));
    s->top = -1;
    strrev(prefix);
    for (i = 0; prefix[i] != '\0'; i++)
    {
        if (!isOperator(prefix[i]))
        {
            push(s, prefix[i] - '0');
        }
        else if (isOperator(prefix[i]))
        {
            i1 = pop(s);
            i2 = pop(s);
            result = giveResult(i1, i2, prefix[i]);
            push(s, result);
        }
    }
    return result;
}

int main()
{
    int result = 0, ch;
    char postfix[50];
    char prefix[50];
    printf("1.PostfixEvaluation\t2.PrefixEvaluation\n");
    scanf("%d", &ch);
    switch (ch)
    {
    case 1:
        printf("Enter the postfix expression to be evaluated\n");
        scanf("%s", postfix);
        result = postfixEvaluation(postfix);
        printf("Result\n%d", result);
        break;

    case 2:
        printf("Enter the prefix expression to be evaluated\n");
        scanf("%s", prefix);
        result = prefixEvaluation(prefix);
        printf("Result\n%d", result);
        break;
    }
    return 0;
}