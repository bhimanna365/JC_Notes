#include <stdio.h>
#include <stdlib.h>

typedef struct node
{
    int data;
    struct node *prev;
    struct node *next;
} node;

node *create(int data)
{
    node *newnode = (node *)malloc(sizeof(node));
    newnode->data = data;
    newnode->next = newnode->prev = newnode;
    return newnode;
}

void display(node *head)
{
    if (head->data == 0)
    {
        printf("List Empty\n");
        return;
    }
    node *temp = head->next;
    while (temp != head)
    {
        printf("%d->", temp->data);
        temp = temp->next;
    }
}

node *insertAt(node *head, int data, int pos)
{
    node *newnode = (node *)malloc(sizeof(node));
    newnode->next = NULL;
    newnode->prev = NULL;
    newnode->data = data;

    if (head->data == 0)
    {
        head->next = newnode;
        newnode->prev = head;
        head->data++;
        newnode->next = head;
        display(head);
        return head;
    }

    if (pos <= 0 || pos > (head->data) + 1)
    {
        printf("Inavlid Position\n");
        display(head);
        return head;
    }

    if (pos == 1)
    {
        node *temp = head->next;
        newnode->next = head->next;
        head->next = newnode;
        newnode->prev = head;
        head->data++;
        display(head);
        return head;
    }

    if (pos == (head->data) + 1)
    {
        node *temp = head;
        while (temp->next != head)
        {
            temp = temp->next;
        }

        temp->next = newnode;
        newnode->prev = temp;
        newnode->next = head;
        head->data++;
        display(head);
        return head;
    }

    else
    {
        int i = 1;
        node *temp = head->next;
        while (i < pos - 1)
        {
            temp = temp->next;
            i++;
        }
        newnode->next = temp->next;
        temp->next->prev = newnode;
        newnode->prev = temp;
        temp->next = newnode;
        head->data++;
        display(head);
        return head;
    }
}

node *removeAt(node *head, int pos)
{
    if (pos <= 0 || pos >= (head->data) + 1)
    {
        printf("Inavlid Position\n");
        display(head);
        return head;
    }

    if (pos == 1)
    {
        node *p = head->next;
        head->next = p->next;
        p->next->prev = head;
        free(p);
        head->data--;
        display(head);
        return head;
    }

    if (pos == (head->data))
    {
        node *temp = head->next;
        node *p = NULL;
        while (temp->next != head)
        {
            p = temp;
            temp = temp->next;
        }
        p->next = temp->next;
        free(temp);
        head->data--;
        display(head);
        return head;
    }

    else
    {
        int i = 1;
        node *temp = head->next;
        while (i < pos)
        {
            temp = temp->next;
            i++;
        }
        temp->prev->next = temp->next;
        temp->next->prev = temp->prev;
        free(temp);
        head->data--;
        display(head);
        return head;
    }
}

node *reverse(node *head)
{

    if (head->data == 0)
    {
        printf("List is empty\n");
        return head;
    }

    node *temp = head->next;
    node *p = head;
    node *curr = NULL;

    while (temp != head)
    {
        curr = temp->next;
        temp->next = p;
        temp->prev = curr;
        p = temp;
        temp = curr;
    }
    head->next = p;
    display(head);
    return head;
}

int main()
{

    int ch, data, pos = 0, val;
    node *head = create(0);
    while (1)
    {
        printf("\n1.InsertAt\n2.DeleteAt\n3.Reverse\n4.SearchByKey\n");
        printf("Enter your choice\n");
        scanf("%d", &ch);
        switch (ch)
        {
        case 1:
            printf("Enter the data\n");
            scanf("%d", &data);
            printf("Enter Position\n");
            scanf("%d", &pos);
            head = insertAt(head, data, pos);
            break;

        case 2:
            printf("Enter Position\n");
            scanf("%d", &pos);
            head = removeAt(head, pos);
            break;

        case 3:
            head = reverse(head);
            break;

        case 4:
            display(head);
            break;

        default:
            break;
        }
    }
}