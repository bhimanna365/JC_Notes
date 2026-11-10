#include <stdio.h>
#include <stdlib.h>
int size = 0;

typedef struct node
{
    int data;
    struct node *next;
} node;

node *display(node *head)
{
    if (size == 0)
    {
        printf("List empty\n");
        return head;
    }
    node *temp = head;
    printf("Linked list is\n");
    do
    {
        printf("%d->", temp->data);
        temp = temp->next;
    } while (temp != head);
}

node *insertAtPos(node *head, int pos, int data)
{
    node *newnode = (node *)malloc(sizeof(node));
    newnode->next = NULL;
    newnode->data = data;

    if (size == 0)
    {
        head = newnode;
        newnode->next = newnode;
        size++;
        display(head);
        return head;
    }

    if (pos <= 0 || pos > size + 1)
    {
        printf("Inavlid Position\n");
        display(head);
        return head;
    }

    if (pos == 1)
    {
        node *temp = head;
        while (temp->next != head)
        {
            temp = temp->next;
        }

        newnode->next = head;
        temp->next = newnode;
        head = newnode;
        size++;
        display(head);
        return head;
    }

    if (pos == size + 1)
    {
        node *temp = head;
        while (temp->next != head)
        {
            temp = temp->next;
        }
        temp->next = newnode;
        newnode->next = head;
        size++;
        display(head);
        return head;
    }

    else
    {
        node *temp = head;
        int i = 1;
        while (i < pos - 1)
        {
            temp = temp->next;
            i++;
        }
        newnode->next = temp->next;
        temp->next = newnode;
        size++;
        display(head);
        return head;
    }
}

node *deleteAtPos(node *head, int pos)
{
    if (size == 0)
    {
        printf("List empty\n");
        display(head);
        return head;
    }

    if (pos <= 0 || pos >= size + 1)
    {
        printf("Invalid Position\n");
        display(head);
        return head;
    }

    if (pos == 1)
    {
        node *temp = head;
        node *p = head;
        while (temp->next != head)
        {
            temp = temp->next;
        }
        temp->next = head->next;
        head = head->next;
        free(p);
        size--;
        display(head);
        return head;
    }

    if (pos == size)
    {
        node *temp = head;
        node *p;
        while (temp->next != head)
        {
            p = temp;
            temp = temp->next;
        }
        p->next = temp->next;
        free(temp);
        size--;
        display(head);
        return head;
    }

    else
    {
        node *temp = head;
        node *p;
        int i = 1;
        while (i < pos)
        {
            p = temp;
            temp = temp->next;
            i++;
        }
        p->next = temp->next;
        free(temp);
        size--;
        display(head);
        return head;
    }
}

node *reverse(node *head)
{
    node *temp = head;
    node *curr = NULL;
    node *p = NULL;

    do
    {
        curr = temp->next;
        temp->next = p;
        p = temp;
        temp = curr;
    } while (temp != head);

    head->next = p;
    head = p;
    display(head);
    return head;
}

node *deleteByKey(node *head, int key)
{
    node *temp = head;
    int i = 1;
    do
    {
        if (temp->data == key)
        {
            head = deleteAtPos(head, i);
            return head;
        }
        temp = temp->next;
        i++;
    } while (temp != head);

    if (temp == head)
    {
        printf("Key not found in the list\n");
        return head;
    }
}

int main()
{
    node *head = NULL;
    int ch, data, pos, key;
    while (1)
    {
        printf("\n1.InsertAtPos\n2.DeleteAtPos\n3.Display\n4.Reverse\n5.DeleteByKey\n");
        printf("Enter your choice\n");
        scanf("%d", &ch);

        switch (ch)
        {
        case 1:
            printf("Enter position\n");
            scanf("%d", &pos);
            printf("Enter data\n");
            scanf("%d", &data);
            head = insertAtPos(head, pos, data);
            break;

        case 2:
            printf("Enter position\n");
            scanf("%d", &pos);
            head = deleteAtPos(head, pos);
            break;

        case 3:
            head = display(head);
            break;

        case 4:
            head = reverse(head);
            break;

        case 5:
            printf("Enter the key to be deleted\n");
            scanf("%d", &key);
            deleteByKey(head, key);
            break;
        }
    }
}